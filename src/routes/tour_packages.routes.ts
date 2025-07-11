import express from 'express'
import { create } from '../controllers/tour_package.controllers'

const router = express.Router()

router.post('/createPackage',create)

export default router