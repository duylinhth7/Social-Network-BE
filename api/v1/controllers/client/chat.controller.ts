import { Request, Response } from "express";
import chatSocket from "../../../../sockets/chat.socket";
import Chat from "../../models/client/chat.model";
import User from "../../models/client/user.model";

// [GET] /index
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomChatId = req.params.id;

    const chats = await Chat.find({
      deleted: false,
      room_chat_id: roomChatId,
    }).lean();
    for (const chat of chats) {
      const user = await User.findOne({
        _id: chat.user_id,
      }).select("avatar fullName");
      chat["infoUser"] = user;
    };
    if(chats){
        res.json({
            code: 200,
            chats: chats
        });
    } else {
        res.json({
            code: 400,
            message: "Không có đoạn chat nào!"
        })
    }
  } catch (error) {
    console.log(error)
    res.json({
        code: 400,
        message: "Lỗi"
    })
  }
};