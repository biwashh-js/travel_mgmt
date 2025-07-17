import express from 'express'
import { create, deletePackage, getAll, getById, updatePackage } from '../controllers/tour_package.controllers'
import { authenticate } from '../middlewares/authorization.middleware'

const router = express.Router()

router.post('/',create)
router.get('/',authenticate(),getAll)
router.get('/:packageId',getById)
router.delete('/:packageId',deletePackage)
router.put('/:packageId',updatePackage)

export default router