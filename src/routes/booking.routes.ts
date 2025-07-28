import express from 'express'
import { book, getAll, getById, update } from '../controllers/booking.controller'
import { authenticate } from '../middlewares/authorization.middleware'
import { allAdmins, allUserAndAdmins } from '../types/global.types'



const router = express.Router()

router.post('/',authenticate(allAdmins),book)
router.get('/',getAll)
router.get('/:id',authenticate(allAdmins),getById)
router.put('/:id',authenticate(allUserAndAdmins),update)

export default router