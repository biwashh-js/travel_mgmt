import {NextFunction, Request, RequestHandler, Response } from "express"
import User from "../models/user.models"
import customError from "../middlewares/error-handler.middleware"
import { asyncHandler } from "../utils/async-handler.utils"
import { deleteFile, uploadFile } from "../utils/cloudinary.utils"
import { getPagination } from "../utils/pagination.utils"


const user_folder = '/user'

//get all user

export const getAllUser = asyncHandler(
    async(req:Request, res: Response, next:NextFunction)=> {

    const {query,limit,page} = req.query
    const page_limit = Number(limit) || 15
    const current_page = Number(page) || 1

    const skip = (current_page - 1)*page_limit
        
    
    // let filter:Record<string,any> = {}

    // if(query){
    //     filter.$or=[
    //         {
    //          firstName:{
    //             $options:'i',
    //             $regex:query
    //             } },
    //              {
    //                 lastName:{
    //                  $options:'i',
    //                  $regex:query
    //             }},
                

    //     ]
    // }

        const users:any = await User.find({}).skip(skip).limit(page_limit).sort({createdAt: -1}).select("-password")
         const total = await User.countDocuments({})

        res.status(200).json({
            message:'All users fetched',
            status:'success',
            success:true,
            data:{users, pagination:getPagination(total,page_limit,current_page)}
        })

})


//get by id

export const getById = asyncHandler(async(req:Request, res:Response, next:NextFunction) =>{
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

})


//update profile
export const updateProfile =asyncHandler(  async(req:Request, res:Response, next:NextFunction) =>{
      const {firstName,lastName,phone,gender} = req.body
      const {userId} = req.params
      const profile_image = req.file as Express.Multer.File;

      const user = await User.findById(userId)
      
      if(!user){
            throw new customError("user not found",404);
        }
    
    if(firstName) user.firstName = firstName
    if(lastName) user.lastName = lastName
    if(phone) user.phone = phone
    if(gender) user.gender = gender
    
    if(profile_image){
        if(user.profile_image?.public_id){
            await deleteFile([user?.profile_image?.public_id])
        }
        user.profile_image = await uploadFile(profile_image.path,user_folder)
    }
    await user.save()

    // OR findByIdAndUpdate ({id},{firstName,lastName,phone,gender},{new:true})

    res.status(200).json({
        message:`profile updated successully`,
        success: true,
        status:'success',
        data:user
    })
  
})


//delete user

export const deleteUser = asyncHandler(async(req:Request,res:Response,next:NextFunction) => {
        const {userId} = req.params
         const user = await User.findById(userId)


         if(!user){
            throw new customError("user not found",404);
        }

        if(user.profile_image?.public_id){
          await deleteFile([user.profile_image?.public_id])
        }
    
        await user.deleteOne()
        
    res.status(200).json({
        message:`user deleted sucessfully`,
        success:true,
        status:'success',
        data:null
    })

})
