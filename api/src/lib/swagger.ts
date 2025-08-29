import { fileURLToPath } from "url";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import pkg from "../../package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: pkg.name,
      version: pkg.version, 
      description: pkg.description, 
    },
    servers: [{ url: "/api" }],
  },
  apis: [
    path.join(__dirname, "../routes/*.ts"),
  ],
});
