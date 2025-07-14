import mongoose from "mongoose"

export const connectDatabase = (uri:string) =>{

    mongoose.connect(uri)
    .then(()=>{
        console.log('databse connected')
    })
    .catch((err)=>{
        console.log('error while connecting to the database')
        console.log(err)
    })

}
