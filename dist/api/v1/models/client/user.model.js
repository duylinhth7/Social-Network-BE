"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model("User", userSchema, "user");
exports.default = User;
