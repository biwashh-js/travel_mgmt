import 'dotenv/config'
import express, { urlencoded } from 'express'
import { connectDatabase } from './config/database.config'
import customError, {errorHandler} from './middlewares/err.handler.middleware'

//importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'


const PORT = process.env.PORT || 8080
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/travel_management'
console.log(PORT,DB_URI)
const app = express()

//connect database
connectDatabase(DB_URI)



//using middlewares
app.use(express.urlencoded({extended:true,limit:'5mb'}))
app.use(express.json({limit:'5mb'}))

app.get('/',(req,res)=>{

    res.status(200).json({
        message:'server is up and running'
    })
})


//using routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)

app.all('{*spalt}',(req, res, next) => {
    const message = `cannot ${req.method} on ${req.url}`
    const error = new customError(message,404)
    next(error)
})

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})

app.use(errorHandler)