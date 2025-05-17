import { Express } from 'express'
import { userRoutes } from './user.route';
import { postRoutes } from './post.route';
import authMiddleware from '../../../middlewares/auth.middleware';

const indexRouterV1 = (app: Express) => {
    const pathV1 = "/api/v1";
    // app.use(pathV1 + "/task", authMiddleware, taskRoutes);
    app.use(pathV1 + "/user",  userRoutes)
    app.use(pathV1 + "/post", authMiddleware, postRoutes)
}
export default indexRouterV1;