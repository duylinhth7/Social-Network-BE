import {Request, Response, NextFunction} from "express"

export const postValidate = async (req:Request, res:Response, next:NextFunction) => {
    if(!req.body.content){
        return;
    };
    next();
}