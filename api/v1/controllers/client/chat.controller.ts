import {Request, Response} from "express";
import chatSocket from "../../../../sockets/chat.socket";

// [GET] /index
export const index = async (req:Request, res:Response):Promise<void> => {
    const user = res.local.user;
    const fullName = user.fullName;

    //socket.io
    //end socket.io
}