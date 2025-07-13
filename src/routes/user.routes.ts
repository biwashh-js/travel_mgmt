import express from 'express'
import { deleteUser, getAllUser, getById, updateProfile} from '../controllers/user.controller'
const router = express.Router()

router.get('/',getAllUser)
router.get('/:userId',getById)
router.put('/:userId',updateProfile)
router.delete('/:userId',deleteUser)


export default router