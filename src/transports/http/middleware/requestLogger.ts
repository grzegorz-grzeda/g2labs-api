import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { Logger } from "../../../core/ports/Logger.js";

export function requestLoggerMiddleware(logger: Logger): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        const start = Date.now();

        logger.info("Request started", {
            event: "http.request.started",
            requestId: req.requestId,
            method: req.method,
            path: req.path,
            originalUrl: req.originalUrl
        });

        res.on("finish", () => {
            const durationMs = Date.now() - start;

            logger.info("Request completed", {
                event: "http.request.completed",
                requestId: req.requestId,
                method: req.method,
                path: req.path,
                originalUrl: req.originalUrl,
                status: res.statusCode,
                durationMs,
                clientIp: req.ip,
                userAgent: req.get("user-agent")
            });
        });

        next();
    };
}
