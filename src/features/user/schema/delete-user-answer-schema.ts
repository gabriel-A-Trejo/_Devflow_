import { z } from "zod";

export const deleteUserAnswerSchema = z.object({
  answerId: z.string().min(1, "answer Id is required"),
});
