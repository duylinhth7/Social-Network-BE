"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const forgetPasswordSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: {
        type: Date,
        expires: 300
    }
}, { timestamps: true });
const ForgetPassword = mongoose.model("ForgetPassword", forgetPasswordSchema, "forget-password");
exports.default = ForgetPassword;
