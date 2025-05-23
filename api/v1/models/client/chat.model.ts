import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    user_id: String,
    content: String,
    room_chat_id: String,
    images: Array,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date

}, { timestamps: true });
const Chat = mongoose.model("Chat", chatSchema, "chat");

export default Chat;