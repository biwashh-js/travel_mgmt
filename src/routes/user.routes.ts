import express from 'express'
import { deleteUser, getAllUser, getById, updateProfile} from '../controllers/user.controller'
import { authenticate } from '../middlewares/authorization.middleware'
import { allAdmins, allUserAndAdmins, onlyUser } from '../types/global.types'
import { upload } from '../middlewares/file-uploader.middleware'

const uploader = upload()
const router = express.Router()

router.get('/',authenticate(allAdmins),getAllUser)
router.get('/:userId',authenticate(allUserAndAdmins),getById)
router.put('/:userId',authenticate(allUserAndAdmins),uploader.single('profile_image'), updateProfile)
router.delete('/:userId',authenticate(allUserAndAdmins),deleteUser)


export default router