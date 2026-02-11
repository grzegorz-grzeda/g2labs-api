import type { Router } from "express";
import { Router as createRouter } from "express";

export function healthRoutes(): Router {
    const router = createRouter();

    router.get("/healthz", (_req, res) => {
        res.json({ data: { ok: true } });
    });

    return router;
}
