import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/follow.controller"

router.post("/:id", controller.follow);
router.delete("/unfollow/:id", controller.unFollow);
router.get("/following/:id", controller.getFollowing)
router.get("/follower/:id", controller.getFollower)

export const followRoutes: Router = router;
