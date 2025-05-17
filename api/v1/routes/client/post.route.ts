import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/post.controller";
import multer from "multer";
// import * as userValidate from "../../../validate/user.validate";
import {
  uploadFields,
  uploadSingle,
} from "../../../../middlewares/uploadCloud.middware";
import { postValidate } from "../../../../validate/post.validate";

const upload = multer();

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 3 },
    { name: "videos", maxCount: 2 },
  ]),
  uploadFields,
  postValidate,
  controller.creatPost
);

router.get("/", controller.getAllPost);
router.patch(
  "/edit/:id",
  upload.fields([
    { name: "images", maxCount: 3 },
    { name: "videos", maxCount: 2 },
  ]),
  uploadFields,
  controller.editPost
);

//like
router.patch("/like/:id", controller.likePost);
router.patch("/unlike/:id", controller.unLike)
//end like

//comment
router.post("/comment/:id", controller.commenntPost);
router.get("/comment/:id", controller. getComment);
router.delete("/comment/:id", controller.deleteComment);
//end comment
router.delete("/delete/:id", controller.deletePost)
export const postRoutes: Router = router;
