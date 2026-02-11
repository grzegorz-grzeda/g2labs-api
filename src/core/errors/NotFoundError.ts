import { ApplicationError } from "./ApplicationError.js";

export class NotFoundError extends ApplicationError {
    public readonly code = "NOT_FOUND";

    constructor(message = "Not found", details?: unknown) {
        super(message, details);
    }
}
