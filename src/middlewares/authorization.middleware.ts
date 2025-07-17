import { NextFunction, Request, Response } from "express"
import customError from "./error-handler.middleware";
import { verifyToken } from "../utils/jwt.utils";
import User from "../models/user.models";
import { IJwtPayload } from "../types/global.types";

export const authenticate = ()=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try{
            const token = req.cookies.access_token;
            console.log(token)

            if(!token){
                throw new customError('Unathorized. Access denied',401)
            }

            //decode token
            const decodedData:IJwtPayload= verifyToken(token)
            console.log(decodedData)

            // check if user exists in database
            const user = await User.findOne({email:decodedData.email})
            if(!user){
                throw new customError('Unathorized. Access Denied',401)
            }

            // token expiry
            if(Date.now()> decodedData?.exp*1000){
                throw new customError('Unathorized. Access Denied',401)
            }

            //role based
            if(decodedData.role === 'USER'){
                throw new customError('Unathorized. Access denied', 401)
            }

            next()
            
        } catch(error){
            next(error)
        }
    }
}

