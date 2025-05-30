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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../api/v1/models/client/user.model"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                const { id, email } = decoded;
                const user = yield user_model_1.default.findOne({
                    _id: id,
                    email: email,
                    deleted: false,
                }).select("-password");
                if (user) {
                    req["user"] = user;
                    next();
                }
            }
        }
        else {
            res.json({
                code: 400,
                message: "Vui lòng gửi lên TOKEN!",
            });
            return;
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "TOKEN gửi lên đã hết hạn hoặc không hợp lệ!"
        });
    }
});
exports.default = authMiddleware;
