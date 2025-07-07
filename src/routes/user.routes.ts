import express from 'express'
import { getAllUser, getById, updateProfile} from '../controllers/user.controller'

const router = express.Router()

router.get('/',getAllUser)
router.get('/:userId',getById)
router.put('/:userId',updateProfile)


export default router