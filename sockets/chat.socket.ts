// socket/chat.socket.ts
import { Server, Socket } from "socket.io";

const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", ({ roomChatId, fullName }) => {
      socket.join(roomChatId);
      console.log(`${fullName} joined room ${roomChatId}`);
    });

    socket.on("chat_message", ({ roomChatId, message }) => {
      io.to(roomChatId).emit("chat_message", {
        sender: socket.id,
        message,
      });
    });

    socket.on("chat", ({message}) => {
        console.log(message)
        io.emit("returnchat", {
            message: "return"
        })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
