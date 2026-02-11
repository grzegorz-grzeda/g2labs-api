import express, { type Express } from "express";
import { healthRoutes } from "./routes/health.routes.js";
import { echoRoutes } from "./routes/echo.routes.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { NotFoundError } from "../../core/errors/index.js";

export type HttpDeps = {
    // later: noteService, authService, etc.
};

export function createHttpApp(_deps: HttpDeps): Express {
    const app = express();

    // middleware
    app.use(express.json());
    app.use(requestIdMiddleware);

    // routes
    app.use(healthRoutes());
    app.use(echoRoutes());

    // 404 handler (for unknown routes)
    app.use((_req, _res) => {
        throw new NotFoundError("Route not found");
    });

    // centralized error handler (must be last)
    app.use(errorHandler);

    return app;
}
