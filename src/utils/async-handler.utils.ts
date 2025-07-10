import { NextFunction, Request, Response ,RequestHandler } from "express"
export const asyncHandler = (fn:RequestHandler) =>{
    return(req:Request, res:Response, next:NextFunction)=>{
     Promise.resolve(fn(req,res,next)).catch((error:any)=>next(error))
    }
}