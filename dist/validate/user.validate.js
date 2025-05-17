"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.otpPassword = exports.forgetPassword = exports.login = exports.register = void 0;
const register = (req, res, next) => {
    if (!req.body.fullName) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    ;
    if (!req.body.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    ;
    next();
};
exports.register = register;
const login = (req, res, next) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    ;
    if (!req.body.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    ;
    next();
};
exports.login = login;
const forgetPassword = (req, res, next) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    }
    ;
    next();
};
exports.forgetPassword = forgetPassword;
const otpPassword = (req, res, next) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Không có email!"
        });
        return;
    }
    ;
    if (!req.body.otp) {
        res.json({
            code: 400,
            message: "Không có OTP!"
        });
        return;
    }
    ;
    next();
};
exports.otpPassword = otpPassword;
const resetPassword = (req, res, next) => {
    if (!req.body.password) {
        res.json({
            code: 200,
            message: "Vui lòng nhập mật khẩu mới!"
        });
        return;
    }
    if (!req.body.authPassword) {
        res.json({
            code: 200,
            message: "Vui lòng nhập xác thực mật khẩu mới!"
        });
        return;
    }
    ;
    if (req.body.password != req.body.authPassword) {
        res.json({
            code: 200,
            message: "Xác thực mật khẩu mới không trùng với mật khẩu mới!"
        });
        return;
    }
    ;
    next();
};
exports.resetPassword = resetPassword;
