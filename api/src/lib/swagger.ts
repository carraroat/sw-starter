import swaggerJSDoc from "swagger-jsdoc";
import pkg from "../../package.json" with { type: "json" };

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
  apis: ["./src/routes/**/*.ts"],
});
