import express from 'express'
import { create, deletePackage, getAll, updatePackage } from '../controllers/tour_package.controllers'
import { getById } from '../controllers/user.controller'

const router = express.Router()

router.post('/',create)
router.get('/',getAll)
router.get('/:packageId',getById)
router.delete('/:packageId',deletePackage)
router.put('/:packageId',updatePackage)

export default router