import express from 'express'
import { getAllUser, getByEmail} from '../controllers/user.controller'

const router = express.Router()

router.get('/getUser',getAllUser)
router.get('/:email',getByEmail)


export default router