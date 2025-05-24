// socket/chat.socket.ts
import { Server, Socket } from "socket.io";
import { uploadToCloud } from "../helpers/uploadToCloud";
import Chat from "../api/v1/models/client/chat.model";
import User from "../api/v1/models/client/user.model";

const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    //socket join roomchat
    socket.on("CLIENT_JOIN_CHAT", ({ roomChatId }) => {
      socket.join(roomChatId);
      console.log(`joined room ${roomChatId}`);
    });
    //end socket join room chat

    //socket chat
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      if (data.images) {
        for (const image of data.images) {
          const link = await uploadToCloud(image);
          images.push(link);
        }
      }
      const chat = new Chat({
        room_chat_id: data.roomChatId,
        user_id: data.user_id,
        message: data.message,
        images: images,
      });
      await chat.save();

      const infoUser = await User.findOne({
        _id: data.user_id,
      }).select("fullName avatar");

      io.to(data.roomChatId).emit("SERVER_RETURN_MESSAGE", {
        user_id: data.user_id,
        message: data.message,
        images: images,
        infoUser: infoUser,
      });
    });
    //end socket chat

    //socket typing (on key up)
    socket.on("CLIENT_ON_KEY_UP", async (data) => {
      const infoUser = await User.findOne({
        _id: data.user_id,
      }).select("fullName avatar");
      socket.broadcast.to(data.roomChatId).emit("SERVER_RETURN_TYPING", {
        infoUser: infoUser,
      });
    });
    //end socket typing (on key up)

    //socket delete tin nhắn
    socket.on("CLIENT_DELETE_MESSAGE", async (data) => {
      try {
        await Chat.deleteOne({
          _id: data.id_message,
          user_id: data.user_id,
        });
        io.to(data.roomChatId).emit("SERVER_RETURN_DELETE_MESSAGE", {
          user_id: data.user_id,
          id_message: data.id_message
        })

      } catch (error) {
        console.log(error)
      }
    });
    //End socket delete tin nhắn

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
