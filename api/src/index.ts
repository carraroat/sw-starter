import "dotenv/config";
import express from "express";
import cors from "cors";
import pino from "pino";
import { router as apiRouter } from "./routes/api.js";
// import { ensureDb } from "./lib/db.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./lib/swagger.js";

const app = express();
const log = pino();

const origins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: origins.length ? origins : true }));
app.use(express.json());

// Routes
app.use("/api", apiRouter);
app.get("/api/health", (_req, res) => res.json({ ok: "Healthy endpoint." }));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ensureDb();

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  log.info(`API: http://localhost:${port}`);
  log.info(`Swagger: at http://localhost:${port}/swagger`);
});
