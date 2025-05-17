import { Router } from "express";
const router: Router = Router();
import multer from "multer";
import * as controller from "../../controllers/client/user.controller"
import * as userValidate from "../../../../validate/user.validate";
import { uploadSingle } from "../../../../middlewares/uploadCloud.middware";

const upload = multer();

router.post(
  "/register",
  upload.single("avatar"),
  uploadSingle,
  userValidate.register,
  controller.register
);
router.post("/login", userValidate.login, controller.login);
router.get("/detail/:id", controller.detail);

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
