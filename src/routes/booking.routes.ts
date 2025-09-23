import express from 'express'
import { book,cancel,confirm,getAllBookings, getAllBookingsByTourPackage, getById, getUserBooking, update } from '../controllers/booking.controller'
import { authenticate } from '../middlewares/authorization.middleware'
import { allAdmins, allUserAndAdmins, onlyAdmin, onlyUser } from '../types/global.types'



const router = express.Router()

router.post('/',authenticate(onlyUser),book)
router.put('/confirm/:id',authenticate(allAdmins),confirm)
router.put('/cancel/:id',authenticate(allAdmins),cancel)
router.get('/',authenticate(allAdmins),getAllBookings)
router.get('/:id',authenticate(allUserAndAdmins),getById)
router.get('/package/:packageId',authenticate(allAdmins),getAllBookingsByTourPackage)
router.get('/user',authenticate(onlyUser),getUserBooking)
router.put('/:id',authenticate(onlyUser),update)
router.delete('/:id',authenticate(onlyAdmin),update)


export default router