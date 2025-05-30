import { Request, Response } from "express";
import User from "../../models/client/user.model";
import md5 from "md5";
import jwt from "jsonwebtoken";
import {
  genarateNumber,
  genarateToken,
  genarateTokenJWT,
} from "../../../../helpers/genarate";
import ForgetPassword from "../../models/client/forget-password.model";
import sendMail from "../../../../helpers/sendMail";

//[GET] /api/v1/user
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    let find = {
      deleted: false,
      status: "active",
    };
    const keyword: RegExp = new RegExp(req.query.keyword, "i");
    if (keyword) {
      find["fullName"] = keyword;
    }
    const users = await User.find(find).select("fullName avatar");
    if (users.length > 0) {
      res.json({
        code: 200,
        users: users,
      });
    } else {
      res.json({
        code: 400,
        message: "Không tìm thấy user này!",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /api/v1/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;
    req.body.password = md5(req.body.password);
    const exitsEmail = await User.findOne({
      email: email,
    });
    if (exitsEmail) {
      res.json({
        code: 400,
        message: "Email này đã tồn tại!",
      });
      return;
    } else {
      req.body.token = genarateToken(30);
      const newUser = new User(req.body);
      await newUser.save();
      const tokenJWT = genarateTokenJWT(newUser);

      res.json({
        code: 200,
        message: "Tạo tài khoản thành công!",
        user: newUser,
        tokenJWT: tokenJWT,
      });
    }
  } catch (error) {
    res.json({
      code: 200,
      message: "Lỗi!",
    });
  }
};
//[POST] //api/v1/user/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email: string = req.body.email;
    const password: string = md5(req.body.password);
    const checkEmail = await User.findOne({
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

    const user = await User.findOne({
      email: email,
    })
      .select("-password")
      .lean();
    const tokenJWT = genarateTokenJWT(user);

    res.json({
      code: 200,
      user: user,
      tokenJWT: tokenJWT,
      message: "Đăng nhập thành công!!!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[GET] /api/v1/user/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.params.id;
  try {
    const user = await User.findOne({
      _id: id,
      deleted: false,
      status: "active",
    }).select("-password");
    res.json({
      code: 200,
      message: "Thành công!",
      user: user,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
//[PATCH] /api/v1/user/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }
    const id = req.params.id;
    const checkExits = await User.findOne({
      _id: id,
      deleted: false,
    });
    if (!checkExits) {
      res.json({
        code: 400,
        message: "Không hợp lệ!",
      });
      return;
    } else {
      await User.updateOne(
        {
          _id: id,
        },
        req.body
      );
    }
    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /api/v1/user/password/forget
export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const checkEmail = await User.findOne({
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
    const otp: string = genarateNumber(5);
    interface ObjectForgetPassword {
      email: string;
      otp: string;
      expireAt: Date;
    }
    const objectForgetPassword: ObjectForgetPassword = {
      email: email,
      otp: otp,
      expireAt: new Date(),
    };
    const forgetPassword = new ForgetPassword(objectForgetPassword);
    await forgetPassword.save();

    //Gửi mail xác nhận OTP;
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
    sendMail(email, subject, html);
    res.json({
      code: 200,
      message: `Đã gửi mã OTP qua email ${email}`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

// [POST] /api/v1/user/password/otp
export const otpPassword = async (req: Request, res: Response) => {
  try {
    const otp: string = req.body.otp;
    const email: string = req.body.email;
    const checkOtp = await ForgetPassword.findOne({
      email: email,
      otp: otp,
    });
    if (!checkOtp) {
      res.json({
        code: 400,
        message: "Không tồn tại!",
      });
      return;
    } else {
      const token = genarateToken(30);
      const user = await User.findOneAndUpdate(
        { email },
        {
          passwordResetToken: token,
          passwordResetExpires: Date.now() + 15 * 60 * 1000, // 15 phút
        },
        { new: true } // lấy document sau khi update
      );
      res.json({
        code: 200,
        passwordResetToken: user.passwordResetToken,
        message: "OTP hợp lệ",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
    return;
  }
};

//[PATCH] /api/v1/user/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const password: string = md5(req.body.password);
    const passwordResetToken: string = req.body.passwordResetToken;
    await User.updateOne(
      {
        passwordResetToken: passwordResetToken,
        passwordResetExpires: { $gt: Date.now() }, // Token còn hạn
      },
      {
        password: password,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    );
    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    res.json({
      code: 200,
      message: "Lỗi!",
    });
  }
};
