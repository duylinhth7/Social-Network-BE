"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    user_id: String,
    content: String,
    images: [],
    videos: [],
    tags: [],
    likes: [],
    comments: [{ user_id: String, content: String }],
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, { timestamps: true });
const Post = mongoose_1.default.model("Post", postSchema, "post");
exports.default = Post;
