import express from 'express'
import { register , login , logout,
  profile,} from '../controllers/auth.controller'
import { authenticate } from '../middlewares/authorization.middleware'
import { allUserAndAdmins } from '../types/global.types'

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post("/logout", logout);
router.get("/me", authenticate(allUserAndAdmins), profile);


export default router