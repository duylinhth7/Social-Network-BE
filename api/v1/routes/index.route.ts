import { Express } from 'express'
import { userRoutes } from './user.route';

const indexRouterV1 = (app: Express) => {
    const pathV1 = "/api/v1";
    // app.use(pathV1 + "/task", authMiddleware, taskRoutes);
    app.use(pathV1 + "/user",  userRoutes)
}
export default indexRouterV1;