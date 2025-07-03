import {Request, Response } from "express"
import User from "../models/user.models"


export const register = async(req:Request, res:Response) => {
    try{

        const {firstName,lastName,email,password,phone,gender} = req.body

        const user = await User.create({firstName,lastName,email,password,phone,gender})

        res.status(201).json({
            message:'user registered successfully',
            success: true,
            status: 'success',
            data: user
        })

    }catch(error:any){
        res.status(500).json({
            message:error?.message ?? 'internal server error',
            success: false,
            status: 'fail',
            data : null
        })

    }
}

//  export const login  = async(req:Request, res:Response) =>{
//     try{
//          const {email,password} = req.body

//         const user = await User.findOne({email,password})
//     }catch(error){

//     }
//  }