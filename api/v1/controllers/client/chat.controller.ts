import { Request, Response } from "express";
import Chat from "../../models/client/chat.model";

// [GET] /index
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomChatId = req.params.id;

    const chats = await Chat.aggregate([
      {
        $match: {
          deleted: false,
          room_chat_id: roomChatId,
        },
      },
      { $sort: { updatedAt: 1 } },
      {
        $lookup: {
          from: "users", // tên collection MongoDB
          localField: "user_id",
          foreignField: "_id",
          as: "infoUser",
        },
      },
      { $unwind: "$infoUser" },
      {
        $project: {
          message: 1,
          user_id: 1,
          room_chat_id: 1,
          updatedAt: 1,
          deleted: 1,
          "infoUser.fullName": 1,
          "infoUser.avatar": 1,
        },
      },
    ]);

    if (chats.length > 0) {
      res.json({
        code: 200,
        chats: chats,
      });
    } else {
      res.json({
        code: 400,
        message: "Không có đoạn chat nào!",
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};
