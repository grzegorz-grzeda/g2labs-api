import type { LogFields, LogLevel, Logger } from "../../core/ports/Logger.js";

type LoggerOptions = {
    service: string;
    env: string;
    level?: LogLevel;
    baseFields?: LogFields;
};

const LEVEL_ORDER: Record<LogLevel, number> = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40
};

function normalizeErrorFields(fields: LogFields | undefined): LogFields | undefined {
    if (!fields || !(fields.error instanceof Error)) return fields;

    const err = fields.error;
    return {
        ...fields,
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack
        }
    };
}

function shouldLog(minLevel: LogLevel, level: LogLevel): boolean {
    return LEVEL_ORDER[level] >= LEVEL_ORDER[minLevel];
}

export function createLogger(options: LoggerOptions): Logger {
    const minLevel = options.level ?? "info";
    const baseFields = options.baseFields ?? {};

    const emit = (level: LogLevel, message: string, fields?: LogFields): void => {
        if (!shouldLog(minLevel, level)) return;

        const normalizedFields = normalizeErrorFields(fields);
        const payload = {
            ts: new Date().toISOString(),
            level,
            service: options.service,
            env: options.env,
            msg: message,
            ...baseFields,
            ...(normalizedFields ?? {})
        };

        const line = JSON.stringify(payload);
        if (level === "error") {
            console.error(line);
            return;
        }

        if (level === "warn") {
            console.warn(line);
            return;
        }

        console.log(line);
    };

    return {
        debug: (message: string, fields?: LogFields) => emit("debug", message, fields),
        info: (message: string, fields?: LogFields) => emit("info", message, fields),
        warn: (message: string, fields?: LogFields) => emit("warn", message, fields),
        error: (message: string, fields?: LogFields) => emit("error", message, fields)
    };
}
