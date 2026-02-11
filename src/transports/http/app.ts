import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import { healthRoutes } from "./routes/health.routes.js";
import { echoRoutes } from "./routes/echo.routes.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { createErrorHandler } from "./middleware/errorHandler.js";
import { requestLoggerMiddleware } from "./middleware/requestLogger.js";
import { NotFoundError } from "../../core/errors/index.js";
import type { Logger } from "../../core/ports/Logger.js";
import { loadOpenApiSpec } from "./openapi.js";

export type HttpDeps = {
    logger: Logger;
};

export function createHttpApp(deps: HttpDeps): Express {
    const app = express();

    // middleware
    app.use(express.json());
    app.use(requestIdMiddleware);
    app.use(requestLoggerMiddleware(deps.logger));

    // routes
    app.use(healthRoutes());
    app.use(echoRoutes());

    const openApiSpec = loadOpenApiSpec();
    app.get("/docs/openapi.json", (_req, res) => {
        res.json(openApiSpec);
    });
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

    // 404 handler (for unknown routes)
    app.use((_req, _res) => {
        throw new NotFoundError("Route not found");
    });

    // centralized error handler (must be last)
    app.use(createErrorHandler(deps.logger));

    return app;
}
