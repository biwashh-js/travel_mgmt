import {NextFunction, Request, Response } from "express"
import User from "../models/user.models"
import CustomError from "../middlewares/err.handler.middleware"


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
        res.status(500).json({
            message:error?.message ?? 'something went wrong',
            success: false,
            status: 'error',
        })
    }
}



//get by id

export const getById = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {userId} = req.params
        
        const user:any = await User.findById(userId).select("-password")
        if(!user){
            throw new CustomError("user not found",404)
        }

        res.status(200).json({
            message:`user fetched`,
            status:"success",
            success:true,
            data:user
        })
    }
    catch(error:any){
        res.status(500).json({
            message:error?.message ?? 'internal server error',
            status:'fail',
            success:false,
        })
    }
}



export const updateProfile = async(req:Request, res:Response, next:NextFunction) =>{
    try{
        const {userId} = req.params
        const query = req.query

        const user = await User.findByIdAndUpdate(userId,req.body,{new:true})

      if(!user){
            throw new CustomError("user not found",404);
        }
    
    
    res.status(200).json({
        message:`user updated`,
        data:user
    })
    }
    catch(error:any){
        res.status(500).json({
            message:error?.message ?? 'internal server error',
            status:'fail',
            success:false,
            data:null
        })
    }
}