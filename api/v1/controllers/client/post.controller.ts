import { Request, Response } from "express";
import Post from "../../models/client/post.model";
import User from "../../models/client/user.model";

// [GET] /post/:id
export const getPostUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.params.id;
    const posts = await Post.find({
      user_id: user_id,
      deleted: false,
    });
    res.json({
      code: 200,
      posts: posts
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    })
  }
};

// [POST] /post
export const creatPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id: string = req.user.id;
    let images = [];
    let videos = [];
    let tags = [];
    if (req.body.images) {
      images = req.body.images;
    }
    if (req.body.videos) {
      videos = req.body.videos;
    }
    if (req.body.tags) {
      tags = JSON.parse(req.body.tags);
    }
    const record = {
      user_id: user_id,
      content: req.body.content,
      images: images,
      videos: videos,
      tags: tags,
    };

    const newPost = new Post(record);
    await newPost.save();
    res.json({
      code: 200,
      message: "Tạo bài viết mới thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

//[GET] /post
export const getAllPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const posts = await Post.find({
      deleted: false,
    }).lean();
    for(const item of posts){
      const infoUser = await User.findOne({
        _id: item.user_id
      });
      item["infoUser"] = infoUser;
    }
    res.json({
      code: 200,
      posts: posts
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

//[PATCH] /edit/:id
export const editPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post_id = req.params.id;
    const user_id = req.user.id;
    const post = await Post.findOne({
      user_id: user_id,
      _id: post_id,
      deleted: false,
    });
    let content = post.content;
    let images = post.images;
    let videos = post.videos;
    let tags = post.tags;
    if (req.body.content) {
      content = JSON.parse(req.body.content);
    }
    if (req.body.images) {
      images = JSON.parse(req.body.images);
    }
    if (req.body.videos) {
      videos = JSON.parse(req.body.videos);
    }
    if (req.body.tags) {
      tags = JSON.parse(req.body.tags);
    }
    await Post.updateOne(
      {
        _id: post_id,
        user_id: user_id,
      },
      {
        content: content,
        images: images,
        videos: videos,
      }
    );
    res.json({
      code: 200,
      message: "Cập nhật thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi",
    });
  }
};

//[DELETE] /delete/:id
export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user.id;
    const post_id = req.params.id;
    await Post.updateOne(
      {
        user_id: user_id,
        _id: post_id,
        deleted: false,
      },
      {
        deleted: true,
      }
    );
    res.json({
      code: 200,
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[PATCH] /like/:id
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id: string = req.user.id;
    const post_id: string = req.params.id;
    const hasLiked = await Post.exists({
      _id: post_id,
      likes: { $in: [user_id] },
    });
    if (hasLiked) {
      res.json({
        code: 400,
        message: "Không hợp lệ",
      });
    } else {
      await Post.updateOne(
        {
          _id: post_id,
          deleted: false,
        },
        {
          $push: { likes: user_id },
        }
      );
      res.json({
        code: 200,
        message: "Like thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 200,
      message: "Lỗi!",
    });
  }
};
//[PATCH] /unlike/:id
export const unLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id: string = req.user.id;
    const post_id: string = req.params.id;
    const hasLiked = await Post.exists({
      _id: post_id,
      likes: { $in: [user_id] },
    });
    if (!hasLiked) {
      res.json({
        code: 400,
        message: "Không hợp lệ",
      });
    } else {
      await Post.updateOne(
        {
          _id: post_id,
          deleted: false,
        },
        {
          $pull: { likes: user_id },
        }
      );
      res.json({
        code: 200,
        message: "Xóa like thành công!",
      });
    }
  } catch (error) {
    res.json({
      code: 200,
      message: "Lỗi!",
    });
  }
};

//[POST] /comment/:id
export const commenntPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user.id;
    const post_id: string = req.params.id;
    const content: string = req.body.content;
    await Post.updateOne(
      {
        _id: post_id,
        deleted: false,
      },
      {
        $push: {
          comments: {
            user_id: user_id,
            content: content,
          },
        },
      }
    );
    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[GET] /comment/:id
export const getComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const post_id = req.params.id;
    const post = await Post.findOne({
      _id: post_id,
      deleted: false,
    })
      .select("comments")
      .lean();
    let comments = post.comments;
    if (comments) {
      for (const item of post.comments) {
        const user_id = item.user_id;
        const infoUser = await User.findOne({
          _id: user_id,
          deleted: false,
        }).select("fullName avatar");
        item["infoUser"] = infoUser;
      }
      res.json({
        code: 200,
        comments: comments,
      });
    } else {
      res.json({
        code: 200,
        message: "Không có comment",
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};

//[DELETE] /comment/:id
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = req.user.id;
    const post_id: string = req.params.id;
    const comment_id: string = req.body.comment_id;
    await Post.updateOne(
      { _id: post_id, deleted: false },
      {
        $pull: {
          comments: {
            user_id: user_id,
            _id: comment_id,
          },
        },
      }
    );
    res.json({
      code: 200,
      message: "Xóa thành công!",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!",
    });
  }
};
