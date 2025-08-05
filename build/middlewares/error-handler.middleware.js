"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
class customError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.isOperational = true;
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.success = false;
        Error.captureStackTrace(this, customError);
    }
}
const errorHandler = (err, req, res, next) => {
    const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    const message = (err === null || err === void 0 ? void 0 : err.message) || "Internal Server Error";
    const success = (err === null || err === void 0 ? void 0 : err.success) || false;
    const status = (err === null || err === void 0 ? void 0 : err.status) || "error";
    res.status(statusCode).json({
        message,
        status,
        success,
        data: null
    });
};
exports.errorHandler = errorHandler;
exports.default = customError;
