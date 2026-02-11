import type { Router } from "express";
import { Router as createRouter } from "express";
import { z } from "zod";
import { validate } from "../validators/zod.js";

export function echoRoutes(): Router {
    const router = createRouter();

    const schema = z.object({
        message: z.string().min(1),
        count: z.number().int().min(1).max(10).optional()
    });

    router.post("/echo", validate("body", schema), (req, res) => {
        // req.body is now parsed and safe
        res.json({ data: req.body });
    });

    return router;
}
