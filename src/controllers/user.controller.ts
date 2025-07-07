import {NextFunction, Request, Response } from "express"
import User from "../models/user.models"
import customError from "../middlewares/error-handler.middleware"


//get all user

export const getAllUser = async(req:Request, res: Response, next:NextFunction)=> {
    try{
        const users:any = await User.find().select("-password")

        res.status(200).json({
            message:'All users fetched',
            status:'success',
            success:true,
            data:users
        })
    }
    catch(error:any){
      next(error)
    }
}



//get by id

export const getById = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {userId} = req.params
        
        const user:any = await User.findById(userId).select("-password")
        if(!user){
            throw new customError("user not found",404)
        }

        res.status(200).json({
            message:`user fetched`,
            status:"success",
            success:true,
            data:user
        })
    }
    catch(error:any){
     next(error)
    }
}



export const updateProfile = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {userId} = req.params
        const query = req.query

        const user = await User.findByIdAndUpdate(userId,req.body,{new:true})

      if(!user){
            throw new customError("user not found",404);
        }
    
    
    res.status(200).json({
        message:`user updated`,
        data:user
    })
    }
    catch(error:any){
        next(error)
    }
}