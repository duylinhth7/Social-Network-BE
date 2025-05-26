"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genarateTokenJWT = exports.genarateNumber = exports.genarateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const genarateToken = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};
exports.genarateToken = genarateToken;
const genarateNumber = (length) => {
    const characters = '0123456789';
    let number = '';
    for (let i = 0; i < length; i++) {
        number += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return number;
};
exports.genarateNumber = genarateNumber;
const genarateTokenJWT = (user) => {
    return jsonwebtoken_1.default.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
exports.genarateTokenJWT = genarateTokenJWT;
