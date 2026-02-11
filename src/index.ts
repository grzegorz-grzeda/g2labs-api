import express from "express";

const app = express();
app.get("/healthz", (_req, res) => res.json({ data: { ok: true } }));

app.listen(3000, () => console.log("Listening on :3000"));
