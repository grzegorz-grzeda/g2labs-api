import { EventEmitter } from "node:events";
import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { requestLoggerMiddleware } from "../src/transports/http/middleware/requestLogger.js";
import type { Logger } from "../src/core/ports/Logger.js";

describe("requestLoggerMiddleware", () => {
    it("logs request start and completion", () => {
        const info = vi.fn();
        const logger: Logger = {
            debug: vi.fn(),
            info,
            warn: vi.fn(),
            error: vi.fn()
        };

        const req = {
            requestId: "req_123",
            method: "GET",
            path: "/health",
            originalUrl: "/health",
            ip: "127.0.0.1",
            get: (header: string) => (header === "user-agent" ? "test-agent" : undefined)
        } as unknown as Request;

        const emitter = new EventEmitter();
        const res = {
            statusCode: 200,
            on: emitter.on.bind(emitter)
        } as unknown as Response;

        const middleware = requestLoggerMiddleware(logger);
        const next = vi.fn();

        middleware(req, res, next);
        emitter.emit("finish");

        expect(next).toHaveBeenCalledTimes(1);
        expect(info).toHaveBeenCalledTimes(2);

        expect(info).toHaveBeenNthCalledWith(1, "Request started", {
            event: "http.request.started",
            requestId: "req_123",
            method: "GET",
            path: "/health",
            originalUrl: "/health"
        });

        expect(info).toHaveBeenNthCalledWith(2, "Request completed", {
            event: "http.request.completed",
            requestId: "req_123",
            method: "GET",
            path: "/health",
            originalUrl: "/health",
            status: 200,
            durationMs: expect.any(Number),
            clientIp: "127.0.0.1",
            userAgent: "test-agent"
        });
    });
});
