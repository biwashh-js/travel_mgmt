import { Schema, model, Types } from "mongoose";
import { Booking_Status } from "../types/enum.types"; 

const bookingSchema = new Schema({
  user: {
    required: true
  },
  tour_package: {
    required: true
  },
  seats_booked: {
    type: Number,
    required: [true, "Number of seats booked is required"],
    min: [1, "At least one seat must be booked"]
  },
  total_price: {
    type: Number,
    required: true
  },
  travel_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(Booking_Status),
    default: Booking_Status.PENDING
  },
}, { timestamps: true });

const Booking = model("Booking", bookingSchema);
export default Booking;
