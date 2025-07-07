import { Request, Response, NextFunction } from "express";

class customError extends Error {
  statusCode: number;
  status: string;
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.success = false;

    Error.captureStackTrace(this, customError);
  }
}

export const errorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    status: err.status || "error",
    success: err.success ?? false,
    data: null
  });
};

export default customError;
