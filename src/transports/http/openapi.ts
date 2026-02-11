import { readFileSync } from "node:fs";
import { join } from "node:path";

export type OpenApiSpec = Record<string, unknown>;

const fallbackSpec: OpenApiSpec = {
    swagger: "2.0",
    info: {
        title: "G2Labs API",
        version: "0.1.0"
    },
    paths: {}
};

export function loadOpenApiSpec(): OpenApiSpec {
    try {
        const specPath = join(process.cwd(), "docs", "openapi", "openapi.json");
        const raw = readFileSync(specPath, "utf-8");
        return JSON.parse(raw) as OpenApiSpec;
    } catch {
        return fallbackSpec;
    }
}
