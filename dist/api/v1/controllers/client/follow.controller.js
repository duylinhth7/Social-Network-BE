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
exports.getFollower = exports.getFollowing = exports.unFollow = exports.follow = void 0;
const user_model_1 = __importDefault(require("../../models/client/user.model"));
const follow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const user_follow_id = req.params.id;
        const exitsFollow = yield user_model_1.default.findOne({
            _id: user_id,
            following: user_follow_id,
        });
        if (exitsFollow) {
            res.json({
                code: 400,
                message: "Bạn đã follow user này!",
            });
        }
        else {
            yield user_model_1.default.updateOne({
                _id: user_id,
            }, {
                $push: { following: user_follow_id },
            });
            yield user_model_1.default.updateOne({
                _id: user_follow_id,
            }, {
                $push: { followews: user_id },
            });
            res.json({
                code: 200,
                message: "Theo dõi user này thành công!",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Lỗi!",
        });
    }
});
exports.follow = follow;
const unFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_unfl = req.params.id;
    try {
        const exitsFl = yield user_model_1.default.findOne({
            _id: req.user.id,
            following: user_unfl,
        });
        if (exitsFl) {
            yield user_model_1.default.updateOne({
                _id: req.user.id,
            }, {
                $pull: { following: user_unfl },
            });
            yield user_model_1.default.updateOne({
                _id: user_unfl,
            }, {
                $pull: { followews: req.user.id },
            });
            res.json({
                code: 200,
                message: "Bỏ theo dõi thành công",
            });
        }
        else {
            res.json({
                code: 400,
                message: "Bạn chưa theo dõi người này",
            });
        }
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi",
        });
    }
});
exports.unFollow = unFollow;
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const user = yield user_model_1.default.findOne({
            _id: user_id,
        }).select("following");
        const followingInfo = yield user_model_1.default.find({
            _id: { $in: user.following },
        }).select("fullName email avatar");
        res.json({
            code: 200,
            followingInfo: followingInfo
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        });
    }
});
exports.getFollowing = getFollowing;
const getFollower = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.params.id;
        const user = yield user_model_1.default.findOne({
            _id: user_id,
        }).select("followews");
        const followerInfo = yield user_model_1.default.find({
            _id: { $in: user.followews },
        }).select("fullName avatar");
        res.json({
            code: 200,
            followerInfo: followerInfo
        });
    }
    catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        });
    }
});
exports.getFollower = getFollower;
