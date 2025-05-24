import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/roomChat.controller"
import authMiddleware from "../../../../middlewares/auth.middleware";
import { chatMiddleware } from "../../../../middlewares/chat.middleware";

router.post("/create", authMiddleware, controller.create);
router.get("/:id", authMiddleware, chatMiddleware, controller.getRoomChat)

export const roomChatRoutes: Router = router;
