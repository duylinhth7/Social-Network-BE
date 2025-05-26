"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = __importStar(require("../../controllers/client/post.controller"));
const multer_1 = __importDefault(require("multer"));
const uploadCloud_middware_1 = require("../../../../middlewares/uploadCloud.middware");
const post_validate_1 = require("../../../../validate/post.validate");
const upload = (0, multer_1.default)();
router.get("/:id", controller.getPostUser);
router.get("/detail/:id", controller.postDetail);
router.post("/", upload.fields([
    { name: "images", maxCount: 3 },
    { name: "videos", maxCount: 2 },
]), uploadCloud_middware_1.uploadFields, post_validate_1.postValidate, controller.creatPost);
router.get("/", controller.getAllPost);
router.patch("/edit/:id", upload.fields([
    { name: "images", maxCount: 3 },
    { name: "videos", maxCount: 2 },
]), uploadCloud_middware_1.uploadFields, controller.editPost);
router.get("/comment/:id", controller.getComment);
router.delete("/comment/:id", controller.deleteComment);
router.delete("/delete/:id", controller.deletePost);
exports.postRoutes = router;
