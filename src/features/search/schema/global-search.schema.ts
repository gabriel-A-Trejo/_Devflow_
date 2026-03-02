import z from "zod";

export const globalSearchSchema = z.object({
  query: z.string().min(1, "Query is required."),
  type: z.string().nullable().optional(),
});
