import type { Router } from "express";
import { Router as createRouter } from "express";

export function healthRoutes(): Router {
    const router = createRouter();

    // #swagger.tags = ["Health"]
    // #swagger.summary = "Health check"
    // #swagger.responses[200] = {
    //   description: "OK",
    //   schema: { $ref: "#/definitions/HealthResponse" }
    // }
    router.get("/healthz", (_req, res) => {
        res.json({ data: { ok: true } });
    });

    return router;
}
