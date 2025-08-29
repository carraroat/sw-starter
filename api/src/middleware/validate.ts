import type { Request, Response, NextFunction } from "express";

type ValidateRequestType = "query" | "params";

// Middleware that validates the request's query or params against a schema,
// ensuring they have the expected shape and types.
const validateRequest =
  (schema: any, type: ValidateRequestType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[type]);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i: { message: string }) => i.message)
        .join("; ");
      return res.status(400).json({ ok: false, error: message });
    }
    req.validated = { ...(req.validated ?? {}), [type]: parsed.data };
    next();
  };

export { validateRequest };
