import { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import logger from "../core/logger";

export class ErrorResponse extends Error {
    statusCode: number;
    errorDetails?: any;

    constructor(message: string, statusCode: number, errorDetails?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errorDetails = errorDetails;
    }
}

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let error = err as ErrorResponse;

    error.message = err.message;

    logger.error(`Error at ${req.method} ${req.url}: ${err.message}`, { stack: err.stack });

    // Axios error handling
    if (err instanceof AxiosError) {
        const message = err.response?.data.message || err.message;
        const statusCode = err.response?.status || 500;
        const errorDetails = err.response?.data;  // Capture detailed error info

        error = new ErrorResponse(message, statusCode, errorDetails);  // Pass error details
    }

    // Send the error response, including detailed error info in development
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server Error",
        errorDetails: error.errorDetails,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};

export default errorMiddleware;
