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
exports.getDashboardCounts = void 0;
const user_models_1 = __importDefault(require("../models/user.models"));
const tour_package_model_1 = __importDefault(require("../models/tour_package.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const enum_types_1 = require("../types/enum.types");
const getDashboardCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsersCount = yield user_models_1.default.countDocuments();
        const usersCount = yield user_models_1.default.countDocuments({ role: enum_types_1.Role.USER });
        const adminsCount = yield user_models_1.default.countDocuments({ role: enum_types_1.Role.ADMIN });
        const tourPackagesCount = yield tour_package_model_1.default.countDocuments();
        const bookingsCount = yield booking_model_1.default.countDocuments();
        res.json({
            totalUsers: totalUsersCount,
            users: usersCount,
            admins: adminsCount,
            tourPackages: tourPackagesCount,
            bookings: bookingsCount,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch counts" });
    }
});
exports.getDashboardCounts = getDashboardCounts;
