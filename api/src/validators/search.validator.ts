import { z } from "zod";

const typeSchema = z.enum(["films", "people"]);

const searchSchema = z.object({
  searchTerm: z.string().min(1, "searchTerm is required."),
  type: typeSchema,
});

const detailSchema = z.object({
  id: z.string().min(1, "id is required."),
  type: typeSchema,
});

export { searchSchema, detailSchema };
