// socket/chat.socket.ts
import { Server, Socket } from "socket.io";
import { uploadToCloud } from "../helpers/uploadToCloud";
import Chat from "../api/v1/models/client/chat.model";
import User from "../api/v1/models/client/user.model";
import Post from "../api/v1/models/client/post.model";

const postSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    //client like
    socket.on("CLIENT_LIKE_POST", async ({ id_post, user_id }) => {
      const hasLiked = await Post.exists({
        _id: id_post,
        likes: { $in: [user_id] },
      });
      if (!hasLiked) {
        await Post.updateOne(
          {
            _id: id_post,
            deleted: false,
          },
          {
            $push: { likes: user_id },
          }
        );
        io.emit("SERVER_RETURN_LIKE", { id_post, user_id });
      }
    });
    //end client like

    //client unlike
    socket.on("CLIENT_UNLIKE_POST", async ({ id_post, user_id }) => {
      const hasLiked = await Post.exists({
        _id: id_post,
        likes: { $in: [user_id] },
      });
      if (hasLiked) {
        await Post.updateOne(
          {
            _id: id_post,
            deleted: false,
          },
          {
            $pull: { likes: user_id },
          }
        );
        io.emit("SERVER_RETURN_UNLIKE", { id_post, user_id });
      }
    });
    //end client unlike

    //Client comment
    socket.on("CLIENT_COMMENT", async ({ user_id, content, id_post }) => {
      try {
        await Post.updateOne(
          {
            _id: id_post,
            deleted: false,
          },
          {
            $push: {
              comments: {
                user_id: user_id,
                content: content,
              },
            },
          }
        );
        io.emit("SERVER_RETURN_COMMENT", {user_id, content, id_post})
      } catch (error) {}
    });
    //end client comment

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default postSocket;
