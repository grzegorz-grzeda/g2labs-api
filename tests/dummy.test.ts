import { describe, it, expect } from "vitest";

describe("Dummy test", () => {
    it("should run basic arithmetic", () => {
        expect(1 + 1).toBe(2);
    });

    it("should handle async", async () => {
        const result = await Promise.resolve("ok");
        expect(result).toBe("ok");
    });
});
