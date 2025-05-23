import { Express } from 'express'
import { userRoutes } from './user.route';
import { postRoutes } from './post.route';
import authMiddleware from '../../../../middlewares/auth.middleware';
import { followRoutes } from './follow.route';
import { roomChatRoutes } from './roomChat.router';
import { chatRoutes } from './chat.route';

const indexRouterV1 = (app: Express) => {
    const pathV1 = "/api/v1";
    // app.use(pathV1 + "/task", authMiddleware, taskRoutes);
    app.use(pathV1 + "/user",  userRoutes)
    app.use(pathV1 + "/post", authMiddleware, postRoutes)
    app.use(pathV1 + "/follow", authMiddleware, followRoutes)
    app.use(pathV1 + "/roomchat", authMiddleware, roomChatRoutes)
    app.use(pathV1 + "/chat", authMiddleware, chatRoutes)
}
export default indexRouterV1;