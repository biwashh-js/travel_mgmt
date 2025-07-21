import express from 'express'
import { create, deletePackage, getAll, getById, updatePackage } from '../controllers/tour_package.controllers'
import { authenticate } from '../middlewares/authorization.middleware'
import { Role } from '../types/enum.types'
import { allAdmins } from '../types/global.types'
import { upload } from '../middlewares/file-uploader.middleware'


//multer uploader
const uploader = upload()

const router = express.Router()

//public routes
router.get('/',getAll)
router.get('/:packageId',getById)

//private routes
router.post('/',authenticate(allAdmins),uploader.fields([
    {
        name:'cover_image',
        maxCount:1
    },
    {
        name:'images',
        maxCount:5
    }
]),create)
router.delete('/:packageId',authenticate(allAdmins),deletePackage)
router.put('/:packageId',authenticate(allAdmins),uploader.fields([
    {
        name:'cover_image',
        maxCount:1
    },
    {
        name:'images',
        maxCount:5
    }
]),updatePackage)

export default router
