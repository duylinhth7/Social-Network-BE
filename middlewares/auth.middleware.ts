
import { Request, Response, NextFunction } from "express";
import User from "../api/v1/models/client/user.model";

const authMiddleware = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token,
            status: "active"
        }).select("-password");
        if (user) {
            req["user"] = user
            next();
        } else{
            res.json({
                code: 400,
                message: "TOKEN không hợp lệ!"
            })
        }
    } else {
        res.json({
            code: 400,
            message: "Vui lòng gửi lên TOKEN!"
        });
        return;
    };
}
export default authMiddleware;