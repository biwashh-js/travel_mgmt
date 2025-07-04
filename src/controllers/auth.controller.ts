import {Request, Response } from "express"
import User from "../models/user.models"
import { hash } from "bcryptjs"
import { comparePassword, hashPassword } from "../utils/bcrypt.utils"
import bcrypt from 'bcryptjs'


export const register = async(req:Request, res:Response) => {
    try{

        const {firstName,lastName,email,password,phone,gender} = req.body

        if(!password){
            throw new Error('password is required')
        }

        const user = new User({
            firstName,
            lastName,
            email,
            // password,
            phone,
            gender
        });
            
        const hashedPassword = await hashPassword(password)
        user.password = hashedPassword
        await user.save()

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



export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if(!email){
            throw new Error('email is required')
        }
        if(!password){
            throw new Error('password is required')
        }

        const user:any= await User.findOne({ email });

        if (!user) {
            throw new Error('credentials does not match ')
            }

        const {password:userPass,...userData} = user?._doc
        const isPasswordMatch = await comparePassword(password,userPass)

         if (!isPasswordMatch) {
            throw new Error('credentials does not match ')
            }
        
        res.status(200).json({
            message:'login successful',
            status:"success",
            success:true,
            data:userData
        })
        }
        catch (error: any) {
        res.status(500).json({
            message: error?.message ?? 'Internal server error',
            success: false,
            status: 'fail',
            data: null
        });
    }
}
