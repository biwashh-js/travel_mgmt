import * as jwt  from 'jsonwebtoken';
import { IJwtPayload, IPayload } from '../types/global.types';


const JWT_SECRET : jwt.Secret = process.env.JWT_SECRET || 'asdfghljfgdhjhghjhgjkljbkjlh'
const EXP_IN :String= process.env.EXP_IN || '1d'


export const generateToken = (payload:IPayload)=>{
    return jwt.sign(payload,JWT_SECRET,{
        expiresIn:EXP_IN as any,

    })
}

export const verifyToken = (token:string)=>{
    return jwt.verify(token,JWT_SECRET) as IJwtPayload
}