import express, { urlencoded } from 'express'
import { connectDatabase } from './config/database.config'


//importing routes
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'


const PORT = 8080
const DB_URI = 'mongodb://127.0.0.1:27017/travel_management'
const app = express()

//connect database
connectDatabase(DB_URI)



//using middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/',(req,res)=>{

    res.status(200).json({
        message:'server is up and running'
    })
})


//using routes
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
})