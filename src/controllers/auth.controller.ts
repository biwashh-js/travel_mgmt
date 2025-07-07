import {NextFunction, Request, Response} from "express"
import User from "../models/user.models"
import { hash } from "bcryptjs"
import { comparePassword, hashPassword } from "../utils/bcrypt.utils"
import bcrypt from 'bcryptjs'
import CustomError from "../middlewares/err.handler.middleware"
import customError from "../middlewares/err.handler.middleware"


export const register = async(req:Request, res:Response, next:NextFunction) => {
    try{

        const {firstName,lastName,email,password,phone,gender} = req.body

        if(!password){
            throw new CustomError('password is required',404)
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



export const login = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { email, password } = req.body;
        if(!email){
            throw new CustomError('email is required',404)
        }
        if(!password){
            throw new CustomError('password is required',404)
        }

        const user:any= await User.findOne({ email });

        if (!user) {
            throw new CustomError('credentials does not match ',400)
            }

        const {password:userPass,...userData} = user?._doc
        const isPasswordMatch = await comparePassword(password,userPass)

         if (!isPasswordMatch) {
            throw new customError('credentials does not match ',400)
            }
        
            // generate token
            
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
