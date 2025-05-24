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
exports.chatMiddleware = void 0;
const room_chat_model_1 = __importDefault(require("../api/v1/models/client/room-chat.model"));
const chatMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const roomChatId = req.params.id;
        const checkRoomChat = yield room_chat_model_1.default.findOne({
            _id: roomChatId,
            deleted: false,
            "users.user_id": userId
        });
        if (checkRoomChat) {
            next();
        }
        else {
            res.json({
                code: 400,
                message: "Bạn không có quyền vào nhóm chat này!"
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        });
    }
});
exports.chatMiddleware = chatMiddleware;
