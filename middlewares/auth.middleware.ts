import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../api/v1/models/client/user.model";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        const { id, email } = decoded;
        const user = await User.findOne({
          _id: id,
          email: email,
          deleted: false,
        }).select("-password");
        if (user) {
          req["user"] = user;
          next();
        }
      }
    } else {
      res.json({
        code: 400,
        message: "Vui lòng gửi lên TOKEN!",
      });
      return;
    }
  } catch (error) {
    res.json({
        code: 400,
        message: "TOKEN gửi lên đã hết hạn hoặc không hợp lệ!"
    })
  }
};
export default authMiddleware;
