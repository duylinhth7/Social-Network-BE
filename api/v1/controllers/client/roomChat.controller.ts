import { Request, Response } from "express";
import RoomChat from "../../models/client/room-chat.model";
import User from "../../models/client/user.model";

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
    }
    res.json({
      code: 200,
      chatId: room._id,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

//[GET] /
export const getRoomChat = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const roomChat = await RoomChat.findOne({
      _id: id,
      deleted: false,
    }).lean();
    for (const item of roomChat.users) {
      const infoUser = await User.findOne({
        _id: item.user_id,
      }).select("fullName avatar");
      item["infoUser"] = infoUser;
    }
    res.json({
      code: 200,
      roomChat: roomChat,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[GET] /getlist
export const getListRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: string = req.user.id;
    const listRooms = await RoomChat.find({
      "users.user_id": user_id,
      typeRoom: "direct",
      deleted: false,
    }).lean();
    for (const item of listRooms) {
      const newFind = item.users.find((item) => item.user_id !== user_id);
      const info = await User.findOne({ _id: newFind.user_id }).select(
        "fullName avatar"
      );
      item["info"] = info;
    }
    res.json({
      code: 200,
      listRooms: listRooms,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};
