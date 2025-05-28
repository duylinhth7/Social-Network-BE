import { Router } from "express";
const router: Router = Router();
import multer from "multer";
import * as controller from "../../controllers/client/user.controller"
import * as userValidate from "../../../../validate/user.validate";
import { uploadSingle } from "../../../../middlewares/uploadCloud.middware";
import authMiddleware from "../../../../middlewares/auth.middleware";

const upload = multer();

router.get("/", authMiddleware, controller.index)
router.post(
  "/register",
  upload.single("avatar"),
  uploadSingle,
  userValidate.register,
  controller.register
);
router.patch(
  "/edit/:id",
  authMiddleware,
  upload.single("avatar"),
  uploadSingle,
  controller.edit
);
router.post("/login", userValidate.login, controller.login);
router.get("/detail/:id", authMiddleware, controller.detail);

//forget-password
router.post(
  "/password/forget",
  userValidate.forgetPassword,
  controller.forgetPassword
);
router.post("/password/otp", userValidate.otpPassword, controller.otpPassword);
router.patch(
  "/password/reset",
  userValidate.resetPassword,
  controller.resetPassword
);
//end forget-password
export const userRoutes: Router = router;
