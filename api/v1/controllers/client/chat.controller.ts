import { Request, Response } from "express";
import Chat from "../../models/client/chat.model";
import User from "../../models/client/user.model";

// [GET] /index
export const index = async (req: Request, res: Response): Promise<void> =>  {
  try {
    const roomChatId = req.params.id;
    const chats = await Chat.find({
      deleted: false,
      room_chat_id: roomChatId,
    });
    if(chats){
      res.json({
        code: 200,
        chats: chats
      })
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
}