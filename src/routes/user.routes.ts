import express from 'express'
import { deleteUser, getAllUser, getById, updateProfile} from '../controllers/user.controller'
import { authenticate } from '../middlewares/authorization.middleware'
import { onlyUser } from '../types/global.types'
import { upload } from '../middlewares/file-uploader.middleware'

const uploader = upload()
const router = express.Router()

router.get('/',getAllUser)
router.get('/:userId',getById)
router.put('/:userId',authenticate(onlyUser),uploader.single('profile_image'), updateProfile)
router.delete('/:userId',deleteUser)


export default router