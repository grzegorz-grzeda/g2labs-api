import { ApplicationError } from "./ApplicationError.js";

export class InternalError extends ApplicationError {
    public readonly code = "INTERNAL_ERROR";

    constructor(message = "Internal server error", details?: unknown) {
        super(message, details);
    }
}
