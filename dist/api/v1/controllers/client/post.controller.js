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
exports.deleteComment = exports.getComment = exports.commenntPost = exports.unLike = exports.likePost = exports.deletePost = exports.editPost = exports.getAllPost = exports.creatPost = exports.getPostUser = void 0;
const post_model_1 = __importDefault(require("../../models/client/post.model"));
const user_model_1 = __importDefault(require("../../models/client/user.model"));
const getPostUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const posts = yield post_model_1.default.find({
            user_id: user_id,
            deleted: false,
        });
        res.json({
            code: 200,
            posts: posts
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        });
    }
});
exports.getPostUser = getPostUser;
const creatPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
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
        const newPost = new post_model_1.default(record);
        yield newPost.save();
        res.json({
            code: 200,
            message: "Tạo bài viết mới thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.creatPost = creatPost;
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_model_1.default.find({
            deleted: false,
        }).lean();
        for (const item of posts) {
            const infoUser = yield user_model_1.default.findOne({
                _id: item.user_id
            });
            item["infoUser"] = infoUser;
        }
        res.json({
            code: 200,
            posts: posts
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.getAllPost = getAllPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.id;
        const user_id = req.user.id;
        const post = yield post_model_1.default.findOne({
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
        yield post_model_1.default.updateOne({
            _id: post_id,
            user_id: user_id,
        }, {
            content: content,
            images: images,
            videos: videos,
        });
        res.json({
            code: 200,
            message: "Cập nhật thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const post_id = req.params.id;
        yield post_model_1.default.updateOne({
            user_id: user_id,
            _id: post_id,
            deleted: false,
        }, {
            deleted: true,
        });
        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.deletePost = deletePost;
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const post_id = req.params.id;
        const hasLiked = yield post_model_1.default.exists({
            _id: post_id,
            likes: { $in: [user_id] },
        });
        if (hasLiked) {
            res.json({
                code: 400,
                message: "Không hợp lệ",
            });
        }
        else {
            yield post_model_1.default.updateOne({
                _id: post_id,
                deleted: false,
            }, {
                $push: { likes: user_id },
            });
            res.json({
                code: 200,
                message: "Like thành công!",
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
exports.likePost = likePost;
const unLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const post_id = req.params.id;
        const hasLiked = yield post_model_1.default.exists({
            _id: post_id,
            likes: { $in: [user_id] },
        });
        if (!hasLiked) {
            res.json({
                code: 400,
                message: "Không hợp lệ",
            });
        }
        else {
            yield post_model_1.default.updateOne({
                _id: post_id,
                deleted: false,
            }, {
                $pull: { likes: user_id },
            });
            res.json({
                code: 200,
                message: "Xóa like thành công!",
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
exports.unLike = unLike;
const commenntPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const post_id = req.params.id;
        const content = req.body.content;
        yield post_model_1.default.updateOne({
            _id: post_id,
            deleted: false,
        }, {
            $push: {
                comments: {
                    user_id: user_id,
                    content: content,
                },
            },
        });
        res.json({
            code: 200,
            message: "Thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.commenntPost = commenntPost;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post_id = req.params.id;
        const post = yield post_model_1.default.findOne({
            _id: post_id,
            deleted: false,
        })
            .select("comments")
            .lean();
        let comments = post.comments;
        if (comments) {
            for (const item of post.comments) {
                const user_id = item.user_id;
                const infoUser = yield user_model_1.default.findOne({
                    _id: user_id,
                    deleted: false,
                }).select("fullName avatar");
                item["infoUser"] = infoUser;
            }
            res.json({
                code: 200,
                comments: comments,
            });
        }
        else {
            res.json({
                code: 200,
                message: "Không có comment",
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.getComment = getComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const post_id = req.params.id;
        const comment_id = req.body.comment_id;
        yield post_model_1.default.updateOne({ _id: post_id, deleted: false }, {
            $pull: {
                comments: {
                    user_id: user_id,
                    _id: comment_id,
                },
            },
        });
        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.deleteComment = deleteComment;
