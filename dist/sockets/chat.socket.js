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
const uploadToCloud_1 = require("../helpers/uploadToCloud");
const chat_model_1 = __importDefault(require("../api/v1/models/client/chat.model"));
const user_model_1 = __importDefault(require("../api/v1/models/client/user.model"));
const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("CLIENT_JOIN_CHAT", ({ roomChatId }) => {
            socket.join(roomChatId);
            console.log(`joined room ${roomChatId}`);
        });
        socket.on("CLIENT_SEND_MESSAGE", (data) => __awaiter(void 0, void 0, void 0, function* () {
            let images = [];
            if (data.images) {
                for (const image of data.images) {
                    const link = yield (0, uploadToCloud_1.uploadToCloud)(image);
                    images.push(link);
                }
            }
            const chat = new chat_model_1.default({
                room_chat_id: data.roomChatId,
                user_id: data.user_id,
                message: data.message,
                images: images,
            });
            yield chat.save();
            const infoUser = yield user_model_1.default.findOne({
                _id: data.user_id,
            }).select("fullName avatar");
            io.to(data.roomChatId).emit("SERVER_RETURN_MESSAGE", {
                user_id: data.user_id,
                message: data.message,
                images: images,
                infoUser: infoUser,
            });
        }));
        socket.on("CLIENT_ON_KEY_UP", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const infoUser = yield user_model_1.default.findOne({
                _id: data.user_id,
            }).select("fullName avatar");
            socket.broadcast.to(data.roomChatId).emit("SERVER_RETURN_TYPING", {
                infoUser: infoUser,
            });
        }));
        socket.on("CLIENT_DELETE_MESSAGE", (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield chat_model_1.default.deleteOne({
                    _id: data.id_message,
                    user_id: data.user_id,
                });
                io.to(data.roomChatId).emit("SERVER_RETURN_DELETE_MESSAGE", {
                    user_id: data.user_id,
                    id_message: data.id_message
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
exports.default = chatSocket;
