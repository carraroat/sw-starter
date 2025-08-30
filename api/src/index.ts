import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { router as apiRouter } from "@routes";
import { swaggerSpec } from "@lib";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGINS || true }));
app.use(express.json());

// Routes
app.use("/api", apiRouter);
app.get("/api/health", (_req, res) => res.json({ ok: "Healthy endpoint." }));
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`API: http://localhost:${port}`);
  console.log(`Swagger: at http://localhost:${port}/api/swagger`);
});
