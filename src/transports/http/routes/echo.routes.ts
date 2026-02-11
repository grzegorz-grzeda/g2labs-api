import type { Router } from "express";
import { Router as createRouter } from "express";
import { z } from "zod";
import { validate } from "../validators/zod.js";

export const echoBodySchema = z.object({
    message: z.string().min(1),
    count: z.number().int().min(1).max(10).optional()
});

export function echoRoutes(): Router {
    const router = createRouter();

    // #swagger.tags = ["Echo"]
    // #swagger.summary = "Echo a message"
    // #swagger.parameters['body'] = {
    //   in: 'body',
    //   required: true,
    //   schema: { $ref: "#/definitions/EchoRequest" }
    // }
    // #swagger.responses[200] = {
    //   description: "Echo response",
    //   schema: { $ref: "#/definitions/EchoResponse" }
    // }
    // #swagger.responses[400] = {
    //   description: "Validation error",
    //   schema: { $ref: "#/definitions/ErrorResponse" }
    // }
    router.post("/echo", validate("body", echoBodySchema), (req, res) => {
        // req.body is now parsed and safe
        res.json({ data: req.body });
    });

    return router;
}
