"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const global_types_1 = require("../types/global.types");
const router = express_1.default.Router();
router.post('/', (0, authorization_middleware_1.authenticate)(global_types_1.onlyUser), booking_controller_1.book);
router.put('/confirm/:id', (0, authorization_middleware_1.authenticate)(global_types_1.allAdmins), booking_controller_1.confirm);
router.put('/cancel/:id', (0, authorization_middleware_1.authenticate)(global_types_1.allAdmins), booking_controller_1.cancel);
router.get('/', (0, authorization_middleware_1.authenticate)(global_types_1.allAdmins), booking_controller_1.getAllBookings);
router.get('/:id', (0, authorization_middleware_1.authenticate)(global_types_1.allUserAndAdmins), booking_controller_1.getById);
router.get('/package/:packageId', (0, authorization_middleware_1.authenticate)(global_types_1.allAdmins), booking_controller_1.getAllBookingsByTourPackage);
router.get('/user', (0, authorization_middleware_1.authenticate)(global_types_1.onlyUser), booking_controller_1.getUserBooking);
router.put('/:id', (0, authorization_middleware_1.authenticate)(global_types_1.onlyUser), booking_controller_1.update);
exports.default = router;
