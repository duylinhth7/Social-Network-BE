import { Request, Response, NextFunction } from "express";
import User from "../../models/client/user.model";

// [POST] /:id
export const follow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user.id;
    const user_follow_id = req.params.id;
    const exitsFollow = await User.findOne({
      _id: user_id,
      following: user_follow_id,
    });
    if (exitsFollow) {
      res.json({
        code: 400,
        message: "Bạn đã follow user này!",
      });
    } else {
      await User.updateOne(
        {
          _id: user_id,
        },
        {
          $push: { following: user_follow_id },
        }
      );
      await User.updateOne(
        {
          _id: user_follow_id,
        },
        {
          $push: { followews: user_id },
        }
      );
      res.json({
        code: 200,
        message: "Theo dõi user này thành công!",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[DELETE] /:id
export const unFollow = async (req: Request, res: Response): Promise<void> => {
  const user_unfl: string = req.params.id;
  try {
    const exitsFl = await User.findOne({
      _id: req.user.id,
      following: user_unfl,
    });
    if (exitsFl) {
      await User.updateOne(
        {
          _id: req.user.id,
        },
        {
          $pull: { following: user_unfl },
        }
      );
      await User.updateOne(
        {
          _id: user_unfl,
        },
        {
          $pull: { followews: req.user.id },
        }
      );
      res.json({
        code: 200,
        message: "Bỏ theo dõi thành công",
      });
    } else {
      res.json({
        code: 400,
        message: "Bạn chưa theo dõi người này",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

//[GET] /following/:id
export const getFollowing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: string = req.params.id;
    const user = await User.findOne({
      _id: user_id,
    }).select("following");
    const followingInfo = await User.find({
      _id: { $in: user.following },
    }).select("fullName email avatar");
    res.json({
        code: 200,
        followingInfo: followingInfo
    })
  } catch (error) {
    res.json({
        code: 400,
        message: "Lỗi"
    })
  }
};

//[GET] /follower/user_id
export const getFollower = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id: string = req.params.id;
    const user = await User.findOne({
      _id: user_id,
    }).select("follower");
    const followerInfo = await User.find({
      _id: { $in: user.followews },
    }).select("fullName avatar");
    res.json({
        code: 200,
        followerInfo: followerInfo
    })
  } catch (error) {
    res.json({
        code: 400,
        message: "Lỗi"
    })
  }
};
