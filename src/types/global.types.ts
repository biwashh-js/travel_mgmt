import mongoose from "mongoose";
import { Role } from "./enum.types";


export const onlyUser = [Role.USER]
export const onlySuperAdmin = [Role.SUPER_ADMIN]
export const onlyAdmin = [Role.ADMIN]
export const allAdmins = [Role.SUPER_ADMIN,Role.ADMIN]
export interface IPayload {
    _id:mongoose.Types.ObjectId;
    email:string;
    firstName:string;
    lastName:string;
    role:Role
}

export interface IJwtPayload extends IPayload{
    iat:number,
    exp:number
}