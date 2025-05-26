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
const post_model_1 = __importDefault(require("../api/v1/models/client/post.model"));
const postSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("CLIENT_LIKE_POST", (_a) => __awaiter(void 0, [_a], void 0, function* ({ id_post, user_id }) {
            const hasLiked = yield post_model_1.default.exists({
                _id: id_post,
                likes: { $in: [user_id] },
            });
            if (!hasLiked) {
                yield post_model_1.default.updateOne({
                    _id: id_post,
                    deleted: false,
                }, {
                    $push: { likes: user_id },
                });
                io.emit("SERVER_RETURN_LIKE", { id_post, user_id });
            }
        }));
        socket.on("CLIENT_UNLIKE_POST", (_a) => __awaiter(void 0, [_a], void 0, function* ({ id_post, user_id }) {
            const hasLiked = yield post_model_1.default.exists({
                _id: id_post,
                likes: { $in: [user_id] },
            });
            if (hasLiked) {
                yield post_model_1.default.updateOne({
                    _id: id_post,
                    deleted: false,
                }, {
                    $pull: { likes: user_id },
                });
                io.emit("SERVER_RETURN_UNLIKE", { id_post, user_id });
            }
        }));
        socket.on("CLIENT_COMMENT", (_a) => __awaiter(void 0, [_a], void 0, function* ({ user_id, content, id_post }) {
            try {
                yield post_model_1.default.updateOne({
                    _id: id_post,
                    deleted: false,
                }, {
                    $push: {
                        comments: {
                            user_id: user_id,
                            content: content,
                        },
                    },
                });
                io.emit("SERVER_RETURN_COMMENT", { user_id, content, id_post });
            }
            catch (error) { }
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
exports.default = postSocket;
