import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Tour_Package from "../models/tour_package.model";
import customError from "../middlewares/error-handler.middleware";
import { Multer } from "multer";
import { deleteFile, uploadFile } from "../utils/cloudinary.utils";


const tour_package_folder = '/tour_packages'

export const create = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const{title,destinations,start_date,end_date,seats_available,total_charge,total_seats,cost_type,description} = req.body

    const {cover_image,images} = req.files as {[fieldname:string]: Express.Multer.File[]}
    // console.log(images)
    if(!cover_image){
        throw new customError('cover image is required',400)
    }
    const tour_package = new Tour_Package({
        title,
        destinations:destinations? JSON.parse(destinations) : null,
        start_date : new Date(start_date),
        end_date : new Date(end_date),
        seats_available:total_seats,
        total_seats,
        total_charge,
        cost_type,
        description,
       

    })

    if(!tour_package){
        throw new customError('something went wrong. Try again later',500)
    }
    
    
    tour_package.cover_image = await uploadFile(cover_image[0].path,tour_package_folder)

    if(images && images.length>0){
        const imagePath = await Promise.all(images.map(img => uploadFile(img.path,tour_package_folder)))
        tour_package.set('images',imagePath)
    }
    await tour_package.save()
     
    res.status(201).json({
        message:'package created successfully',
        success:true,
        status:'success',
        data:tour_package
    })
})

//get all
export const getAll = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const tour_packages = await Tour_Package.find({})
      res.status(200).json({
            message:'packages fetched successfully.',
            status:'success',
            success:true,
            data:tour_packages
        })
})


export const getById = asyncHandler(async(req:Request, res:Response, next:NextFunction) =>{
const {packageId} = req.params
        
        const tour_package = await Tour_Package.findById(packageId)
        if(!tour_package){
            throw new customError("package not found",404)
        }
        res.status(200).json({
            message:`package fetched`,
            status:"success",
            success:true,
            data:tour_package
    
        })

})


export const deletePackage = asyncHandler(async(req:Request,res:Response,next:NextFunction) => {
    
        const {cover_image,images} = req.files as {[fieldname:string]: Express.Multer.File[]}  
        const {packageId} = req.params
    
        const tour_package = await Tour_Package.findById(packageId)

        if(!tour_package){
            throw new customError('package not found',404)
        }

        if(tour_package.cover_image){
            await deleteFile([tour_package.cover_image?.public_id])
        }

        if(tour_package.images){
            await deleteFile(tour_package.images.map(image => image?.public_id as string))
        }
       

        await tour_package.deleteOne()
    

     res.status(200).json({
        message:`package deleted sucessfully`,
        success:true,
        status:'success',
        data:tour_package
    })

})


export const updatePackage = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const{
        title,
        destinations,
        start_date,
        end_date,
        seats_available,
        total_charge,
        cost_type,
        description,
        deletedImage
        } = req.body

    const {packageId} = req.params

    const {cover_image,images} = req.files as {[fieldname:string]: Express.Multer.File[]}

    const tour_package = await Tour_Package.findById(packageId)
    if(!tour_package){
        throw new customError('package not found',404)

    }

    if(title) tour_package.title = title
    if(destinations) tour_package.destinations = destinations
    if(start_date) tour_package.start_date = start_date
    if(end_date) tour_package.end_date = end_date
    if(seats_available) tour_package.seats_available = seats_available
    if(total_charge) tour_package.total_charge = total_charge
    if(cost_type) tour_package.cost_type = cost_type
    if(description) tour_package.cost_type = description
    
    if(cover_image){
        if(tour_package.cover_image){
            await deleteFile([tour_package?.cover_image?.public_id])
        }
        tour_package.cover_image = await uploadFile(cover_image[0].path,tour_package_folder)
    }

    
    if(deletedImage && deletedImage.length > 0 && tour_package.images.length > 0 ){
        await deleteFile(deletedImage)
        const oldImages = tour_package.images.filter(
            (img) => !deletedImage.includes(img.public_id)
               
        )

        //delete image from cloudinary


        tour_package.set('images',oldImages)
    }


    if(images && images.length>0){
        const imagePath = await Promise.all(images.map(img => uploadFile(img.path,tour_package_folder)))
        tour_package.set('images',[...tour_package.images, ...imagePath])
    }

    await tour_package.save()

    // OR findByIdAndUpdate (packageId,{title,
    //     destinations,
    //     start_date,
    //     end_date,
    //     seats_available,
    //     total_charge,
    //     cost_type,
    //     description},{new:true,reValidate:true})
    // if(destinations){
    //   tour_package.destinations = JSON.parse(destinations);
    //     await tour_package.save()
    // }


     res.status(200).json({
        message:`tour package updated successully`,
        success: true,
        status:'success',
        data:tour_package
    })
})