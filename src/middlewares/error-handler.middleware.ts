import { Request, Response, NextFunction } from "express";

class customError extends Error {
  statusCode: number;
  status: 'success' | 'fail' | 'error';
  success: boolean;
  isOperational:boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.isOperational = true ;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.success = false;
    Error.captureStackTrace(this, customError);
  }
}


export const errorHandler = (err:any,req: Request,res: Response,next: NextFunction) => {
  const statusCode = err?.statusCode || 500;
  const message =  err?.message || "Internal Server Error"
  const success =  err?.success || false
  const status = err?.status || "error"

  res.status(statusCode).json({
    message,
    status,
    success,
    data: null
  });
};

export default customError;
