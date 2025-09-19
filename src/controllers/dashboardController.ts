
import { Request, Response } from "express";
import User from "../models/user.models";
import Tour_Package from "../models/tour_package.model";
import Booking from "../models/booking.model";


export const getDashboardCounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const usersCount = await User.countDocuments({ role: "user" });
    const adminsCount = await User.countDocuments({ role: "admin" });
    const tourPackagesCount = await Tour_Package.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    res.json({
      users: usersCount,
      admins: adminsCount,
      tourPackages: tourPackagesCount,
      bookings: bookingsCount,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counts" });
  }
};
