import cloudinary from "../config/cloudinary.config"
import customError from "../middlewares/error-handler.middleware"
import fs from 'fs'

export const uploadFile = async(path:string,folder:string = '/') =>{
    try{
        const {public_id,secure_url} = await cloudinary.uploader.upload(path,{
            folder:'travel_mgmt' + folder,
            allowed_formats:["jpg","png",'gif','webp','svg'],
            unique_filename:true
        })

        if(fs.existsSync(path)){
            fs.unlinkSync(path)
        }

        return {
            public_id,
            path:secure_url
        }
    }catch(error){
        throw new customError('file upload error',500)
    }
}   


export const deleteFile = async(public_ids:string[])=>{
    try{
      const ids =await Promise.all(public_ids.map(async(public_id:string) => await cloudinary.uploader.destroy(public_id)))
      return true
    }
    catch(error){
        throw new customError('file delete error',500)
    }

}