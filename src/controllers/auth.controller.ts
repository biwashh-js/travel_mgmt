import {NextFunction, Request, Response} from "express"
import User from "../models/user.models"
import { hash } from "bcryptjs"
import { comparePassword, hashPassword } from "../utils/bcrypt.utils"
import bcrypt from 'bcryptjs'
import customError from "../middlewares/error-handler.middleware"
import { asyncHandler } from "../utils/async-handler.utils"
import { generateToken } from "../utils/jwt.utils"
import { IPayload } from "../types/global.types"


export const register = asyncHandler(async(req:Request, res:Response, next:NextFunction) => {
        const {firstName,lastName,email,password,phone,gender,role} = req.body

        if(!password){
            throw new customError('password is required',404)
        }

        const user = new User({
            firstName,
            lastName,
            email,
            // password,
            phone,
            gender,
            role
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

  
}
)


export const login =asyncHandler( async (req: Request, res: Response, next:NextFunction) => {
    
        const { email, password } = req.body;
        if(!email){
            throw new customError('email is required',400)
        }
        if(!password){
            throw new customError('password is required',400)
        }

        const user:any= await User.findOne({ email });

        if (!user) {
            throw new customError('credentials does not match ',400)
            }

        const {password:userPass,...userData} = user?._doc
        const isPasswordMatch = await comparePassword(password,userPass)

         if (!isPasswordMatch) {
            throw new customError('credentials does not match ',400)
            }
        
            // generate token
        const payload:IPayload= {
            _id:user._id,
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            role: user.role
        }

        const token = generateToken(payload)
        console.log(token)
            
        res.status(200).json({
            message:'login successful',
            status:"success",
            success:true,
            data:{
                data:userData,
                access_token:token
            }
        })
}
)
