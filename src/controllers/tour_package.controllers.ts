import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Tour_Package from "../models/tour_package.model";
import customError from "../middlewares/error-handler.middleware";

export const create = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const{title,destinations,start_date,end_date,seats_available,total_charge,cost_type,description} = req.body
    
    const tour_package = await Tour_Package.create({
        title,
        destinations:JSON.parse(destinations),
        start_date : new Date(start_date),
        end_date : new Date(end_date),
        seats_available,
        total_charge,
        cost_type,
        description

    })

    if(!tour_package){
        throw new customError('something went wrong. Try again later',500)
    }

     
    res.status(201).json({
        message:'package created successfully',
        success:true,
        status:'success',
        data:tour_package
    })
})

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
        const {packageId} = req.params
         const deletePackage = await Tour_Package.findByIdAndDelete(packageId)

      if(!deletePackage){
            throw new customError("package not found",404);
        }
    
    
    res.status(200).json({
        message:`package deleted sucessfully`,
        success:true,
        status:'success',
        data:null
    })

})


export const updatePackage = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const{title,destinations,start_date,end_date,seats_available,total_charge,cost_type,description} = req.body
    const {packageId} = req.params
    const tour_package = await Tour_Package.findById(packageId)
    if(!tour_package){
        throw new customError('package not found',404)

    }

    if(title) tour_package.title = title
    if(destinations) tour_package.destinations = destinations
    if(seats_available) tour_package.seats_available = seats_available
    if(total_charge) tour_package.total_charge = total_charge
    if(cost_type) tour_package.cost_type = cost_type
    if(description) tour_package.cost_type = description

    await tour_package.save()

     res.status(200).json({
        message:`tour package updated successully`,
        success: true,
        status:'success',
        data:tour_package
    })
})