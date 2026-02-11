export abstract class ApplicationError extends Error {
    public abstract readonly code: string;
    public readonly details?: unknown;

    protected constructor(message: string, details?: unknown) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
    }
}
