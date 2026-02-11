import { ApplicationError } from "./ApplicationError.js";

export class ValidationError extends ApplicationError {
    public readonly code = "VALIDATION_ERROR";

    constructor(message = "Validation failed", details?: unknown) {
        super(message, details);
    }
}
