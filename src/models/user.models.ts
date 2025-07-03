import {Schema,model} from "mongoose";
import { Gender, Role } from "../types/enum.types";

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
        minlength:6
    },
    role:{
        type:String,
        enum:Object.values(Role),
        default:Role.USER
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