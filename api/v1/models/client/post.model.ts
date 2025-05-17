import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    user_id: String,
    content: String,
    images: [],
    videos: [],
    tags: [],
    likes: [],
    comments: [{ user_id: String, content: String }],
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "post");

export default Post;
