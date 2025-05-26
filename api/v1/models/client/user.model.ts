import mongoose from "mongoose";
const userSchema = new mongoose.Schema({

    fullName: String,
    email: String,
    password: String,
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    followews: [],
    following: [],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,

}, { timestamps: true });

const User = mongoose.model("User", userSchema, "user");

export default User;