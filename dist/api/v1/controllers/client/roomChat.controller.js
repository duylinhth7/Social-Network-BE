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
exports.getListRoom = exports.getRoomChat = exports.create = void 0;
const room_chat_model_1 = __importDefault(require("../../models/client/room-chat.model"));
const user_model_1 = __importDefault(require("../../models/client/user.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId } = req.body;
        let room = yield room_chat_model_1.default.findOne({
            "users.user_id": { $all: [senderId, receiverId] },
            users: { $size: 2 },
            typeRoom: "direct",
        });
        if (!room) {
            room = new room_chat_model_1.default({
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
            yield room.save();
        }
        res.json({
            code: 200,
            chatId: room._id,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.create = create;
const getRoomChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const roomChat = yield room_chat_model_1.default.findOne({
            _id: id,
            deleted: false,
        }).lean();
        for (const item of roomChat.users) {
            const infoUser = yield user_model_1.default.findOne({
                _id: item.user_id,
            }).select("fullName avatar");
            item["infoUser"] = infoUser;
        }
        res.json({
            code: 200,
            roomChat: roomChat,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.getRoomChat = getRoomChat;
const getListRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const listRooms = yield room_chat_model_1.default.find({
            "users.user_id": user_id,
            typeRoom: "direct",
            deleted: false,
        }).lean();
        for (const item of listRooms) {
            const newFind = item.users.find((item) => item.user_id !== user_id);
            const info = yield user_model_1.default.findOne({ _id: newFind.user_id }).select("fullName avatar");
            item["info"] = info;
        }
        res.json({
            code: 200,
            listRooms: listRooms,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.getListRoom = getListRoom;
