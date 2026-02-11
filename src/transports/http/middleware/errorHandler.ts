import type { NextFunction, Request, Response } from "express";
import {
    ApplicationError,
    InternalError,
    NotFoundError,
    ValidationError
} from "../../../core/errors/index.js";

type ErrorBody = {
    error: {
        code: string;
        message: string;
        details?: unknown;
        requestId?: string;
    };
};

function sendError(res: Response, status: number, body: ErrorBody): void {
    res.status(status).json(body);
}

function statusFromAppError(err: ApplicationError): number {
    if (err instanceof ValidationError) return 400;
    if (err instanceof NotFoundError) return 404;
    // InternalError and unknown app errors
    return 500;
}

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (res.headersSent) return;

    // Known application errors
    if (err instanceof ApplicationError) {
        return sendError(res, statusFromAppError(err), {
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                requestId: req.requestId
            }
        });
    }

    // Unknown error -> wrap safely
    const wrapped = new InternalError(
        err instanceof Error ? err.message : "Unexpected error"
    );

    return sendError(res, 500, {
        error: {
            code: wrapped.code,
            message: wrapped.message,
            requestId: req.requestId
        }
    });
}
