import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/roomChat.controller"
import { chatMiddleware } from "../../../../middlewares/chat.middleware";

router.post("/create", controller.create);
router.get("/:id", chatMiddleware, controller.getRoomChat)
router.post("/getlistchat", controller.getListRoom)

export const roomChatRoutes: Router = router;
