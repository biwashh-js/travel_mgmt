import mongoose, { model, Schema } from "mongoose";
import { Booking_Status } from "../types/enum.types";

const bookingSchema = new Schema({
  user: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  tour_package: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tour_Package',
    required: true
  },
  total_person:{
    type:Number,
    min:[1,'minimum 1 person is required'],
    required:[true,'total person is required']

  },
  total_amount: {
    type: Number,
    required: [true,'total amount is required']
  },
  status:{
    type:String,
    default:Booking_Status.PENDING,
    enum:Object.values(Booking_Status)
  }
}, { timestamps: true });

const   Booking = model("booking", bookingSchema);
export default Booking;
