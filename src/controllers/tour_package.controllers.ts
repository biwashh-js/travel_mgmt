import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import Tour_Package from "../models/tour_package.model";
import customError from "../middlewares/error-handler.middleware";

export const create = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const{title,plans,start_date,end_date,seats_available,total_charge,cost_type,description} = req.body

    const tour_package = await Tour_Package.create({
        title,
        plans,
        start_date,end_date,
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