import { Request, Response } from "express";
import RoomChat from "../../models/client/room-chat.model";

//[POST] /index
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId } = req.body;

    let room = await RoomChat.findOne({
      "users.user_id": { $all: [senderId, receiverId] },
      users: { $size: 2 },
      typeRoom: "direct",
    });

    if (!room) {
      room = new RoomChat({
        typeRoom: "direct",
        users: [
          {
            user_id: senderId,
            role: "admin",
          },
          {
            user_id: receiverId,
            role: "admin",
          },
        ],
      });
      await room.save();
    };
    res.json({
        code: 200,
        chatId: room._id
    })
  } catch (error) {
    res.json({
        code: 400,
        message: "Lỗi"
    })
  }
};
