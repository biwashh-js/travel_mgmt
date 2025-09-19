import 'dotenv/config'
import express, {Request,Response, NextFunction, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import helmet from "helmet"
import { connectDatabase } from './config/database.config'
import customError, {errorHandler} from './middlewares/error-handler.middleware'

//importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import packageRoutes from './routes/tour_package.routes'
import bookingRoutes from './routes/booking.routes'
import dashboardRoutes from "./routes/adminDashboard.routes";


const PORT = process.env.PORT || 8080
const DB_URI = process.env.DB_URI ?? ''
const app = express()


//connect database
connectDatabase(DB_URI)


const allowed_origins= [
  "http://localhost:5173",
   process.env.FRONT_END_URL,
   "https://travel-mgmt.onrender.com"

]
//using middlewares
app.use(
  cors({
    origin: (origin,callback)=>{
      if(!origin) callback(null,true)

      if(!allowed_origins.includes(origin)){
        callback(new customError("cors error, origin not expected",400))
      } else{
        callback(null,true)
      }
    },

    credentials: true,
  })
);
app.use(helmet())
app.use(express.urlencoded({extended:true,limit:'5mb'}))
app.use(express.json({limit:'5mb'}))
app.use(cookieParser())   


// serving static files
app.use('/api/uploads/',express.static('uploads/'))

app.get('/',(req,res)=>{

    res.status(200).json({
        message:'server is up and running'
    })
})


//using routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/tour_package',packageRoutes)
app.use('/api/booking',bookingRoutes)
app.use("/api/admin/dashboard", dashboardRoutes);

// fallback routing
app.all('{*spalt}',(req:Request, res:Response, next:NextFunction) => {
    const error:any = new customError( `cannot ${req.method} on ${req.originalUrl}`,404)
    next(error)
})

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})

app.use(errorHandler)
