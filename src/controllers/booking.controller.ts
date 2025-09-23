import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler.utils";
import customError from "../middlewares/error-handler.middleware";
import Tour_Package from "../models/tour_package.model";
import Booking from "../models/booking.model";
import { Booking_Status, Package_Charge } from "../types/enum.types";
import { sendMail } from "../utils/nodemailer.utils";
import { getPagination } from "../utils/pagination.utils";

// create booking
export const book = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {tour_package,total_person} = req.body
    const user = req.user._id
    let total_cost:number

    if(!tour_package){
        throw new customError('tour package is required',400)
    }
    const tourPackage = await Tour_Package.findById(tour_package)
    if(!tourPackage){
        throw new customError('package not found',400)
    }

    if(tourPackage?.seats_available<Number(total_person)){
        throw new customError(`only ${tourPackage.seats_available} seats left`,400)
    }

    const booking = new Booking({total_person,tour_package:tourPackage._id,user})
    
    if(tourPackage.cost_type === Package_Charge.PER_PERSON){
        total_cost = Number(total_person) * Number(tourPackage?.total_charge)
        booking.total_amount = total_cost
    }
    else{
        const totalDays:any = new Date(tourPackage.end_date).getDate() - new Date(tourPackage.start_date).getDate()
        total_cost = totalDays * total_person * Number(tourPackage?.total_charge) 
        booking.total_amount = total_cost
    }
    tourPackage.seats_available -= Number(total_person)
    
   let html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #f0f4f8; border-radius: 10px;">
    <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
      <h2 style="color: #1e88e5; text-align: center;">Booking Confirmation</h2>
      <p style="color: #333;">Thank you for booking with us! Here are your booking details:</p>

      <ul style="list-style: none; padding: 0; color: #444;">
        <li style="margin-bottom: 10px;"><strong>🎫 Tour Package:</strong> ${tourPackage.title}</li>
        <li style="margin-bottom: 10px;"><strong>👥 Total Persons:</strong> ${booking.total_person}</li>
        <li style="margin-bottom: 10px;"><strong>💰 Total Amount:</strong> <span style="color: #388e3c;">NPR ${booking.total_amount}</span></li>
        <li style="margin-bottom: 10px;"><strong>📌 Status:</strong> <span style="font-weight: bold; color: ${booking.status === 'CONFIRMED' ? '#2e7d32' : '#f4511e'};">${booking.status}</span></li>
      </ul>

      <p style="color: #555;">We’ll keep you updated with any changes to your booking status.</p>
      <p style="color: #777;">Regards,<br/><strong>Travel Booking Team</strong></p>
    </div>
  </div>
`;

      await sendMail({
      html,
      
      to: req.user.email,
      subject: "Booking success",
    });

    await booking.save()
    await tourPackage.save()
    
    res.status(200).json({
        message: 'Package booked',
        data: booking,
        status:"success",
        success: true
    })
})


//get all bookings for admin
export const getAllBookings = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
   
    const {query,limit,page} = req.query
    const page_limit = Number(limit) || 15
    const current_page = Number(page) || 1

    const skip = (current_page - 1)*page_limit
    
    const bookings = await Booking.find({}).skip(skip).limit(page_limit).sort({createdAt: -1}).populate("tour_package").populate('user')
     const total = await Booking.countDocuments({})

    res.status(200).json({
        message:'all booking fetched',
        success:true,
        status:'success',
        data:{bookings, pagination:getPagination(total,page_limit,current_page)}
    })
})


// get all bookings by tour package

export const getAllBookingsByTourPackage= asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {packageId} = req.params
      const {query,limit,page} = req.query
    const page_limit = Number(limit) || 15
    const current_page = Number(page) || 1
    const skip = (current_page - 1)*page_limit

    const bookings = await Booking.find({tour_package:packageId}).skip(skip).limit(page_limit).sort({createdAt: -1}).populate("tour_package").populate('user')

    const total = await Booking.countDocuments({tour_package:packageId})

    res.status(200).json({
        message:'all booking fetched',
        success:true,
        status:'success',
        data:{bookings, pagination: getPagination(total,page_limit,current_page)}
    })
})


//get by id
export const getById = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const booking = Booking.findById(id).populate("tour_package").populate("user")
    if(!booking){
        throw new customError('booking not found',404)

    }
        res.status(200).json({
            message:`booking fetched`,
            status:"success",
            success:true,
            data:booking
        })

})


//get users booking of logged in user
export const getUserBooking = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const user = req.user._id
    const bookings = await Booking.find({user}).populate("tour_package")

    res.status(200).json({
        message:'booking fetched',
        data:bookings,
        success:true,
        status:'success'
    })
})

//cancel
export const cancel = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params

    const booking = await Booking.findById(id)

    if(!booking){
        throw new customError('booking not found',404)
    }
    const tour_package = await Tour_Package.findById(booking.tour_package)
    booking.status = Booking_Status.CANCELLED

    if(tour_package){
    tour_package.seats_available += Number(booking.total_person)
    await tour_package.save()
    }

    await booking.save()
const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3f3; border-radius: 10px;">
    <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); border-left: 6px solid #e53935;">
      <h2 style="color: #e53935; text-align: center;">Booking Cancelled</h2>
      <p style="color: #333;">We regret to inform you that your booking has been cancelled. Please find the details below:</p>

      <ul style="list-style: none; padding: 0; color: #444;">
        <li style="margin-bottom: 10px;"><strong>🎫 Tour Package:</strong> ${tour_package?.title}</li>
        <li style="margin-bottom: 10px;"><strong>👥 Total Persons:</strong> ${booking.total_person}</li>
        <li style="margin-bottom: 10px;"><strong>💰 Total Amount:</strong> NPR ${booking.total_amount}</li>
        <li style="margin-bottom: 10px;"><strong>📌 Status:</strong> <span style="font-weight: bold; color: #e53935;">${booking.status}</span></li>
      </ul>

      <p style="color: #555;">If this was a mistake or you wish to rebook, please contact our support team. We're here to assist you.</p>

      <p style="color: #777;">Warm regards,<br/><strong>Travel Booking Team</strong></p>
    </div>
  </div>
`;

       await sendMail({
      html,
      
      to: req.user.email,
      subject: "Booking success",
    });
    res.status(200).json({
        message:'Booking cancelled',
        status:'success',
        success:true,
        data:booking
    })

})

//confirm
export const confirm = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const booking = await Booking.findById(id)
    if(!booking){
        throw new customError('booking not found',404)
    }


    booking.status  = Booking_Status.CONFIRMED
    await booking.save()

    //confirmation email
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #e8f5e9; border-radius: 10px;">
    <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); border-left: 6px solid #43a047;">
      <h2 style="color: #2e7d32; text-align: center;">Booking Confirmed</h2>
      <p style="color: #333;">Thank you for booking with us! We're excited to confirm your reservation. Here are your booking details:</p>

      <ul style="list-style: none; padding: 0; color: #444;">
        <li style="margin-bottom: 10px;"><strong>👥 Total Persons:</strong> ${booking.total_person}</li>
        <li style="margin-bottom: 10px;"><strong>💰 Total Amount:</strong> NPR ${booking.total_amount}</li>
        <li style="margin-bottom: 10px;"><strong>📌 Status:</strong> <span style="font-weight: bold; color: #2e7d32;">${booking.status}</span></li>
      </ul>

      <p style="   await sendMail({
      html,
      
      to: req.user.email,
      subject: "Booking success",
    });color: #555;">We’ll keep you updated with any changes. If you have any questions, feel free to contact us anytime.</p>

      <p style="color: #777;">Best regards,<br/><strong>Travel Booking Team</strong></p>
    </div>
  </div>
`;


    res.status(200).json({
        message:'Booking confirmed',
        status:'success',
        success:true,
        data:booking
    })
})

//update
export const update = asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
    const {id} = req.params
    const { total_person } = req.body
    let total_cost:number
    const booking = await Booking.findById(id)

    if(!booking){
        throw new customError('booking not found',404)
    }

     const tour_package = await Tour_Package.findById(booking.tour_package)
     if(!tour_package){
        throw new customError('tour package not found',404)
     }

    if(total_person){
        const oldPerson = booking.total_person
        const difference = total_person - oldPerson

        if(difference > 0){
            if(tour_package.seats_available < difference){
                throw new customError('Not enough seats avaibale',400)
            }
            tour_package.seats_available -= difference
        }
        else if(difference < 0){
            tour_package.seats_available += Math.abs(difference)
        }
        booking.total_person = total_person
    }
    if(tour_package.cost_type === Package_Charge.PER_PERSON){
        total_cost = Number(total_person) * Number(tour_package?.total_charge)
        booking.total_amount = total_cost
    }
     else{
        const totalDays:any = new Date(tour_package.end_date).getDate() - new Date(tour_package.start_date).getDate()
        total_cost = totalDays * total_person * Number(tour_package?.total_charge) 
        booking.total_amount = total_cost
    }

    await booking.save()
    await tour_package.save()

    res.status(200).json({
        message:'booking updated',
        status:'success',
        success: true,
        data:booking
    })


})

//delete
export const remove = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {id} = req.params
    const booking = await Booking.findById(id)
    if(!booking){
        throw new customError('booking not found',404)
    }

    const tour_package = await Tour_Package.findById(booking.tour_package)
    if(tour_package){
        tour_package.seats_available += Number(booking.total_person)
        await tour_package.save()
    }

    await booking.deleteOne()

    res.status(200).json({
        message:'booking deleted',
        status:'success',
        success:true
    })
})






// filter get bookings by user
// -> filter