import express from 'express'
import { create, deletePackage, updatePackage } from '../controllers/tour_package.controllers'

const router = express.Router()

router.post('/',create)
router.delete('/:packageId',deletePackage)
router.put('/:packageId',updatePackage)

export default router