import { NextFunction, Request, Response } from "express";

//register
export const register = (req:Request, res:Response, next:NextFunction) => {
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
    };
    if (!req.body.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    };
    next();
}
//end register

//login
export const login = (req:Request, res:Response, next:NextFunction) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    };
    if (!req.body.password) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    };
    next();
}
//end login

//forgetPassword
export const forgetPassword = (req:Request, res:Response, next:NextFunction) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
        return;
    };
    next();
}
//end forgetPassword

//otp password
export const otpPassword = (req:Request, res:Response, next:NextFunction) => {
    if (!req.body.email) {
        res.json({
            code: 400,
            message: "Không có email!"
        });
        return;
    };
    if (!req.body.otp) {
        res.json({
            code: 400,
            message: "Không có OTP!"
        });
        return;
    };
    next();
}
//end otp password

//reset password
export const resetPassword = (req:Request, res:Response, next:NextFunction) => {
    if(!req.body.password){
        res.json({
            code: 200,
            message: "Vui lòng nhập mật khẩu mới!"
        });
        return;
    }
    if(!req.body.authPassword){
        res.json({
            code: 200,
            message: "Vui lòng nhập xác thực mật khẩu mới!"
        });
        return;
    };
    if(req.body.password != req.body.authPassword){
        res.json({
            code: 200,
            message: "Xác thực mật khẩu mới không trùng với mật khẩu mới!"
        });
        return;
    };
    next();
}
//end reset password