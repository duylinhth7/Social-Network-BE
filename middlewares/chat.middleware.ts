import {Request, Response, NextFunction} from "express";
import RoomChat from "../api/v1/models/client/room-chat.model";


export const chatMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.user.id;
        const roomChatId = req.params.id;
        const checkRoomChat = await RoomChat.findOne({
            _id: roomChatId,
            deleted: false,
            "users.user_id": userId
        })
        if (checkRoomChat) {
            next();
        } else {
            res.json({
                code: 400,
                message: "Bạn không có quyền vào nhóm chat này!"
            })
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
}