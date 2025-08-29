import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    validated?: {
      query?: { searchTerm: string; type: "films" | "people" };
      params?: { id: string; type: "films" | "people" };
      body?: unknown;
    };
  }
}

export {};
