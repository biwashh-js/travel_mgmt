import {Schema,model} from "mongoose";
import { Gender } from "../types/enum.types";

const useSchema = new Schema({
    firstName:{
        type:String,
        required:[true,'firstName is required'],
        trim:true
    },
    lastName:{
        type:String,
        required:[true,'lastName is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'email is required'],
        trim:true,
        unique:[true,'user with this email already exists']
    },
    password:{
        type:String,
        requred:[true,'[password is required'],
        min:6
    },
    phone:{
        type:String
    },
    gender:{
        type:String,
        enum:Object.values(Gender),
        default : Gender.NOTPREFER

    }

    
},{timestamps:true})

const User = model('user',useSchema)

export default User