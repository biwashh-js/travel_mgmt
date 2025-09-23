"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.confirm = exports.cancel = exports.getUserBooking = exports.getById = exports.getAllBookingsByTourPackage = exports.getAllBookings = exports.book = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const tour_package_model_1 = __importDefault(require("../models/tour_package.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const enum_types_1 = require("../types/enum.types");
const nodemailer_utils_1 = require("../utils/nodemailer.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
// create booking
exports.book = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tour_package, total_person } = req.body;
    const user = req.user._id;
    let total_cost;
    if (!tour_package) {
        throw new error_handler_middleware_1.default('tour package is required', 400);
    }
    const tourPackage = yield tour_package_model_1.default.findById(tour_package);
    if (!tourPackage) {
        throw new error_handler_middleware_1.default('package not found', 400);
    }
    if ((tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.seats_available) < Number(total_person)) {
        throw new error_handler_middleware_1.default(`only ${tourPackage.seats_available} seats left`, 400);
    }
    const booking = new booking_model_1.default({ total_person, tour_package: tourPackage._id, user });
    if (tourPackage.cost_type === enum_types_1.Package_Charge.PER_PERSON) {
        total_cost = Number(total_person) * Number(tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.total_charge);
        booking.total_amount = total_cost;
    }
    else {
        const totalDays = new Date(tourPackage.end_date).getDate() - new Date(tourPackage.start_date).getDate();
        total_cost = totalDays * total_person * Number(tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.total_charge);
        booking.total_amount = total_cost;
    }
    tourPackage.seats_available -= Number(total_person);
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
    yield (0, nodemailer_utils_1.sendMail)({
        html,
        to: req.user.email,
        subject: "Booking success",
    });
    yield booking.save();
    yield tourPackage.save();
    res.status(200).json({
        message: 'Package booked',
        data: booking,
        status: "success",
        success: true
    });
}));
//get all bookings for admin
exports.getAllBookings = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, limit, page } = req.query;
    const page_limit = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    const bookings = yield booking_model_1.default.find({}).skip(skip).limit(page_limit).sort({ createdAt: -1 }).populate("tour_package").populate('user');
    const total = yield booking_model_1.default.countDocuments({});
    res.status(200).json({
        message: 'all booking fetched',
        success: true,
        status: 'success',
        data: { bookings, pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page) }
    });
}));
// get all bookings by tour package
exports.getAllBookingsByTourPackage = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const { query, limit, page } = req.query;
    const page_limit = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    const bookings = yield booking_model_1.default.find({ tour_package: packageId }).skip(skip).limit(page_limit).sort({ createdAt: -1 }).populate("tour_package").populate('user');
    const total = yield booking_model_1.default.countDocuments({ tour_package: packageId });
    res.status(200).json({
        message: 'all booking fetched',
        success: true,
        status: 'success',
        data: { bookings, pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page) }
    });
}));
//get by id
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = booking_model_1.default.findById(id).populate("tour_package").populate("user");
    if (!booking) {
        throw new error_handler_middleware_1.default('booking not found', 404);
    }
    res.status(200).json({
        message: `booking fetched`,
        status: "success",
        success: true,
        data: booking
    });
}));
//get users booking of logged in user
exports.getUserBooking = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user._id;
    const bookings = yield booking_model_1.default.find({ user }).populate("tour_package");
    res.status(200).json({
        message: 'booking fetched',
        data: bookings,
        success: true,
        status: 'success'
    });
}));
//cancel
exports.cancel = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default('booking not found', 404);
    }
    const tour_package = yield tour_package_model_1.default.findById(booking.tour_package);
    booking.status = enum_types_1.Booking_Status.CANCELLED;
    if (tour_package) {
        tour_package.seats_available += Number(booking.total_person);
        yield tour_package.save();
    }
    yield booking.save();
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; background-color: #fff3f3; border-radius: 10px;">
    <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); border-left: 6px solid #e53935;">
      <h2 style="color: #e53935; text-align: center;">Booking Cancelled</h2>
      <p style="color: #333;">We regret to inform you that your booking has been cancelled. Please find the details below:</p>

      <ul style="list-style: none; padding: 0; color: #444;">
        <li style="margin-bottom: 10px;"><strong>🎫 Tour Package:</strong> ${tour_package === null || tour_package === void 0 ? void 0 : tour_package.title}</li>
        <li style="margin-bottom: 10px;"><strong>👥 Total Persons:</strong> ${booking.total_person}</li>
        <li style="margin-bottom: 10px;"><strong>💰 Total Amount:</strong> NPR ${booking.total_amount}</li>
        <li style="margin-bottom: 10px;"><strong>📌 Status:</strong> <span style="font-weight: bold; color: #e53935;">${booking.status}</span></li>
      </ul>

      <p style="color: #555;">If this was a mistake or you wish to rebook, please contact our support team. We're here to assist you.</p>

      <p style="color: #777;">Warm regards,<br/><strong>Travel Booking Team</strong></p>
    </div>
  </div>
`;
    yield (0, nodemailer_utils_1.sendMail)({
        html,
        to: req.user.email,
        subject: "Booking success",
    });
    res.status(200).json({
        message: 'Booking cancelled',
        status: 'success',
        success: true,
        data: booking
    });
}));
//confirm
exports.confirm = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default('booking not found', 404);
    }
    booking.status = enum_types_1.Booking_Status.CONFIRMED;
    yield booking.save();
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
        message: 'Booking confirmed',
        status: 'success',
        success: true,
        data: booking
    });
}));
//update
exports.update = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { total_person } = req.body;
    let total_cost;
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default('booking not found', 404);
    }
    const tour_package = yield tour_package_model_1.default.findById(booking.tour_package);
    if (!tour_package) {
        throw new error_handler_middleware_1.default('tour package not found', 404);
    }
    if (total_person) {
        const oldPerson = booking.total_person;
        const difference = total_person - oldPerson;
        if (difference > 0) {
            if (tour_package.seats_available < difference) {
                throw new error_handler_middleware_1.default('Not enough seats avaibale', 400);
            }
            tour_package.seats_available -= difference;
        }
        else if (difference < 0) {
            tour_package.seats_available += Math.abs(difference);
        }
        booking.total_person = total_person;
    }
    if (tour_package.cost_type === enum_types_1.Package_Charge.PER_PERSON) {
        total_cost = Number(total_person) * Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
        booking.total_amount = total_cost;
    }
    else {
        const totalDays = new Date(tour_package.end_date).getDate() - new Date(tour_package.start_date).getDate();
        total_cost = totalDays * total_person * Number(tour_package === null || tour_package === void 0 ? void 0 : tour_package.total_charge);
        booking.total_amount = total_cost;
    }
    yield booking.save();
    yield tour_package.save();
    res.status(200).json({
        message: 'booking updated',
        status: 'success',
        success: true,
        data: booking
    });
}));
//delete
exports.remove = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const booking = yield booking_model_1.default.findById(id);
    if (!booking) {
        throw new error_handler_middleware_1.default('booking not found', 404);
    }
    const tour_package = yield tour_package_model_1.default.findById(booking.tour_package);
    if (tour_package) {
        tour_package.seats_available += Number(booking.total_person);
        yield tour_package.save();
    }
    yield booking.deleteOne();
    res.status(200).json({
        message: 'booking deleted',
        status: 'success',
        success: true
    });
}));
// filter get bookings by user
// -> filter
