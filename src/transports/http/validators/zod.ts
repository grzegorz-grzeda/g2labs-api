import type { NextFunction, Request, Response } from "express";
import type { ZodError, ZodSchema } from "zod";
import { ValidationError } from "../../../core/errors/index.js";

type Source = "body" | "query" | "params" | "headers";

function isZodError(err: unknown): err is ZodError {
    return typeof err === "object" && err !== null && "issues" in err;
}

/**
 * Validate a selected request part with a Zod schema.
 * On success: replaces req[source] with the parsed (typed) value.
 * On failure: throws ValidationError with Zod issues as details.
 */
export function validate(source: Source, schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            const parsed = schema.parse(req[source]);
            // Express types aren't generic here, so we assign carefully.
            // This is safe because the schema owns the shape.
            (req as any)[source] = parsed;
            next();
        } catch (err: unknown) {
            if (isZodError(err)) {
                throw new ValidationError("Invalid request data", {
                    source,
                    issues: err.issues
                });
            }
            throw err;
        }
    };
}
