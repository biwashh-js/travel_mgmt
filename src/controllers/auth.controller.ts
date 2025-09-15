import { NextFunction, Request, Response } from "express";
import User from "../models/user.models";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import CustomError from "../middlewares/error-handler.middleware";
import { asyncHandler } from "../utils/async-handler.utils";
import { generateToken } from "../utils/jwt.utils";
import { IPayload } from "../types/global.types";
import { sendMail } from "../utils/nodemailer.utils";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phone, gender } = req.body;

    if (!password) {
      throw new CustomError("password is required", 400);
    }

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender,
    });

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;

    await user.save();

    res.status(201).json({
      message: "user registered successfully!",
      success: true,
      status: "success",
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email) {
      throw new CustomError("email required", 400); //400
    }

    if (!password) {
      throw new CustomError("password required", 400); //400
    }

    const user: any = await User.findOne({ email });

    if (!user) {
      throw new CustomError("credentials does not match", 400); //400
    }

    const { password: userPass, ...userData } = user?._doc;

    const isPasswordMatch = await comparePassword(password, userPass);

    if (!isPasswordMatch) {
      throw new CustomError("credentials does not match", 400); //400
    }

    const payload: IPayload = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    //! generate token
    const token = generateToken(payload);

    console.log(token);
    res
      .cookie("access_token", token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge:
          Number(process.env.COOKIE_EXPIRES_IN ?? "7") * 24 * 60 * 60 * 1000,
        sameSite: "none",
      })
      .status(201)
      .json({
        message: "Login successful",
        status: "success",
        success: true,
        data: {
          data: userData,
          access_token: token,
        },
      });
  }
);

// !logout
export const logout = asyncHandler((req: Request, res: Response) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "development" ? false : true,
    })
    .status(200)
    .json({
      message: "Logged out successfully",
      success: true,
      status: "success",
      data: null,
    });
});



//! get profile
export const profile = asyncHandler(async(req:Request,res:Response)=>{

  const user_id = req.user._id;

  const user = await User.findById(user_id);

  if(!user){
    throw new CustomError('profile not found',404)
  }

  res.status(200).json({
    mesage:'profile fetched',
    data:user,
    success:true,
    status:'success'
  })

})