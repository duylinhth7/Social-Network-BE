"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const chat_model_1 = __importDefault(require("../../models/client/chat.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roomChatId = req.params.id;
        const chats = yield chat_model_1.default.aggregate([
            {
                $match: {
                    deleted: false,
                    room_chat_id: roomChatId,
                },
            },
            { $sort: { updatedAt: 1 } },
            {
                $lookup: {
                    from: "users",
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
                chats,
            });
        }
        else {
            res.json({
                code: 400,
                message: "Không có đoạn chat nào!",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.index = index;
