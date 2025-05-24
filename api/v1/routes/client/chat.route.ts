import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/chat.controller"
import { chatMiddleware } from "../../../../middlewares/chat.middleware";

router.get("/:id", chatMiddleware, controller.index);

export const  chatRoutes: Router = router;
