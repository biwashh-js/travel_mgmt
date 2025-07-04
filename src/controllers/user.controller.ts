import {Request, Response } from "express"
import User from "../models/user.models"
export const getAllUser = async(req:Request, res: Response)=> {
    try{
        const users = await User.find()
        res.status(200).json({
            message:'users fetched',
            status:'success',
            success:true,
            data:users
        })


    }
    catch(error:any){
        res.status(500).json({
            message:error?.message ?? 'internal server error',
            success: false,
            status: 'fail',
            data : null
        })
    }
}


export const getByEmail = async(req:Request, res:Response) =>{
    try{
        const email= req.params.email

         if (!email) {
           throw new Error('email is required')
        }

        const user = await User.findOne({email})
        if(!user){
            throw new Error("no user exists with provided email")
        }
        res.status(200).json({
            message:`user with email ${email} fetched`,
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
            data:null
        })
    }
}