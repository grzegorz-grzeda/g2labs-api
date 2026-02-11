import { createHttpApp } from "./transports/http/app.js";
import { createLogger } from "./infra/logger/index.js";

const PORT = Number(process.env.PORT ?? 3000);
const PROFILE = process.env.APP_PROFILE ?? "vps";
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";

async function main(): Promise<void> {
    const logger = createLogger({
        service: "g2labs-api",
        env: PROFILE,
        level: LOG_LEVEL === "debug" || LOG_LEVEL === "info" || LOG_LEVEL === "warn" || LOG_LEVEL === "error"
            ? LOG_LEVEL
            : "info"
    });

    // later: load config, connect mongo, build services/repos, etc.
    const deps = { logger };

    const app = createHttpApp(deps);
    app.listen(PORT, () => {
        logger.info("Server started", {
            event: "server.started",
            port: PORT
        });
    });
}

main().catch((err) => {
    const logger = createLogger({
        service: "g2labs-api",
        env: PROFILE,
        level: "error"
    });

    logger.error("Fatal startup error", {
        event: "server.startup.failed",
        error: err instanceof Error ? err : new Error("Unknown error")
    });
    process.exit(1);
});
