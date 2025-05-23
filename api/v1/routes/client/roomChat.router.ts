import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/roomChat.controller"
import authMiddleware from "../../../../middlewares/auth.middleware";

router.post("/create", authMiddleware, controller.create);

export const roomChatRoutes: Router = router;
