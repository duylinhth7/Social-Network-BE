import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/chat.controller"
import authMiddleware from "../../../../middlewares/auth.middleware";

router.post("/:id", authMiddleware, controller.index);

export const chatRoutes: Router = router;
