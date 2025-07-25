import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import customError from "../middlewares/error-handler.middleware";
import Tour_Package from "../models/tour_package.model";
import Booking from "../models/booking.model";


export const book = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {tour_package,total_person} = req.body

    if(!tour_package){
        throw new customError('tour package is required',400)
    }
    const tourPackage = await Tour_Package.findById(tour_package)
    if(!tourPackage){
        throw new customError('package not found',400)
    }
    const booking = await Booking.create({total_person,tour_package:tourPackage._id})

    res.status(200).json({
        message: 'Package booked',
        data: booking,
        status:"success",
        success: true
    })
})