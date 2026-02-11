import { createHttpApp } from "./transports/http/app.js";

const PORT = Number(process.env.PORT ?? 3000);

async function main(): Promise<void> {
    // later: load config, init logger, connect mongo, build services/repos, etc.
    const deps = {};

    const app = createHttpApp(deps);
    app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on :${PORT}`);
    });
}

main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
