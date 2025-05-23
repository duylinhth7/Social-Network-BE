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
exports.resetPassword = exports.otpPassword = exports.forgetPassword = exports.edit = exports.detail = exports.login = exports.register = exports.index = void 0;
const user_model_1 = __importDefault(require("../../models/client/user.model"));
const md5_1 = __importDefault(require("md5"));
const genarate_1 = require("../../../../helpers/genarate");
const forget_password_model_1 = __importDefault(require("../../models/client/forget-password.model"));
const sendMail_1 = __importDefault(require("../../../../helpers/sendMail"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
            status: "active",
        };
        const keyword = new RegExp(req.query.keyword, "i");
        if (keyword) {
            find["fullName"] = keyword;
        }
        const users = yield user_model_1.default.find(find).select("fullName avatar");
        if (users.length > 0) {
            res.json({
                code: 200,
                users: users
            });
        }
        else {
            res.json({
                code: 400,
                message: "Không tìm thấy user này!"
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
});
exports.index = index;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        req.body.password = (0, md5_1.default)(req.body.password);
        const exitsEmail = yield user_model_1.default.findOne({
            email: email,
        });
        if (exitsEmail) {
            res.json({
                code: 400,
                message: "Email này đã tồn tại!",
            });
            return;
        }
        else {
            req.body.token = (0, genarate_1.genarateToken)(30);
            const newUser = new user_model_1.default(req.body);
            yield newUser.save();
            res.cookie("token", newUser.token, {
                httpOnly: true,
                secure: true,
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                user: newUser,
            });
        }
    }
    catch (error) {
        res.json({
            code: 200,
            message: "Lỗi!",
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = (0, md5_1.default)(req.body.password);
        const checkEmail = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
            status: "active",
        });
        if (!checkEmail) {
            res.json({
                code: 400,
                message: "Email không hợp lệ!",
            });
            return;
        }
        if (checkEmail.password != password) {
            res.json({
                code: 400,
                message: "Sai mật khẩu",
            });
            return;
        }
        res.cookie("token", checkEmail.token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const user = yield user_model_1.default.findOne({
            token: checkEmail.token,
        }).select("-password");
        res.json({
            code: 200,
            user: user,
            message: "Đăng nhập thành công!!!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.login = login;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield user_model_1.default.findOne({
            _id: id,
            deleted: false,
            status: "active",
        }).select("-password");
        res.json({
            code: 200,
            message: "Thành công!",
            user: user,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        const id = req.params.id;
        const checkExits = yield user_model_1.default.findOne({
            _id: id,
            deleted: false,
        });
        if (!checkExits) {
            res.json({
                code: 400,
                message: "Không hợp lệ!",
            });
            return;
        }
        else {
            yield user_model_1.default.updateOne({
                _id: id,
            }, req.body);
        }
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.edit = edit;
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const checkEmail = yield user_model_1.default.findOne({
            email: email,
            deleted: false,
        });
        if (!checkEmail) {
            res.json({
                code: 400,
                message: "Email không hợp lệ!",
            });
            return;
        }
        const otp = (0, genarate_1.genarateNumber)(5);
        const objectForgetPassword = {
            email: email,
            otp: otp,
            expireAt: new Date(),
        };
        const forgetPassword = new forget_password_model_1.default(objectForgetPassword);
        yield forgetPassword.save();
        const subject = "Mã OTP xác minh đặt lại mật khẩu!";
        const html = `
        <div style="max-width: 500px; margin: 0 auto; padding: 20px; 
              border: 1px solid #e0e0e0; border-radius: 8px; 
              background-color: #f9f9f9; font-family: Arial, sans-serif; 
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); color: #333;">
            <h2 style="text-align: center; color: #007BFF;">Mã OTP Xác Minh</h2>
            <p>Xin chào,</p>
            <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
            <p style="margin: 16px 0;">Vui lòng sử dụng mã OTP bên dưới để xác minh yêu cầu:</p>
            <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; padding: 12px 24px; 
                        font-size: 24px; font-weight: bold; 
                        background-color: #e6f0ff; color: #007BFF; 
                        border-radius: 6px; letter-spacing: 2px;">
                ${otp}
            </span>
            </div>
            <p><strong>Lưu ý:</strong> Mã OTP chỉ có hiệu lực trong vòng <strong>5 phút</strong>.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 14px; color: #666; text-align: center;">
            Trân trọng,<br>
            Đội ngũ hỗ trợ
            </p>
        </div>
        `;
        (0, sendMail_1.default)(email, subject, html);
        res.json({
            code: 200,
            message: `Đã gửi mã OTP qua email ${email}`,
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.forgetPassword = forgetPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
        const checkOtp = yield forget_password_model_1.default.findOne({
            email: email,
            otp: otp,
        });
        if (!checkOtp) {
            res.json({
                code: 400,
                message: "Không tồn tại!",
            });
            return;
        }
        else {
            const user = yield user_model_1.default.findOne({
                email: email,
            });
            res.cookie("token", user.token);
            res.json({
                code: 200,
                message: "OTP hợp lệ",
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
        return;
    }
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = (0, md5_1.default)(req.body.password);
        const token = req.cookies.token;
        yield user_model_1.default.updateOne({
            token: token,
        }, {
            password: password,
        });
        res.json({
            code: 200,
            message: "Đổi mật khẩu thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 200,
            message: "Lỗi!",
        });
    }
});
exports.resetPassword = resetPassword;
