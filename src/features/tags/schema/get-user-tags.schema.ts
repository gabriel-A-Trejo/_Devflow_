import z from "zod";

export const getUserTagsSchema = z.object({
  userId: z.string().min(1, "User id is required"),
});
