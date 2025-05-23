"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = require("./user.route");
const post_route_1 = require("./post.route");
const auth_middleware_1 = __importDefault(require("../../../../middlewares/auth.middleware"));
const follow_route_1 = require("./follow.route");
const roomChat_router_1 = require("./roomChat.router");
const chat_route_1 = require("./chat.route");
const indexRouterV1 = (app) => {
    const pathV1 = "/api/v1";
    app.use(pathV1 + "/user", user_route_1.userRoutes);
    app.use(pathV1 + "/post", auth_middleware_1.default, post_route_1.postRoutes);
    app.use(pathV1 + "/follow", auth_middleware_1.default, follow_route_1.followRoutes);
    app.use(pathV1 + "/roomchat", auth_middleware_1.default, roomChat_router_1.roomChatRoutes);
    app.use(pathV1 + "/chat", auth_middleware_1.default, chat_route_1.chatRoutes);
};
exports.default = indexRouterV1;
