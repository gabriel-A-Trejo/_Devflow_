import z from "zod";

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, "Question is required")
    .max(130, "Question can not exceed 130 characters."),
  content: z.string().min(100, "Answer has to have more than 100 characters."),
  userAnswer: z.string().optional(),
});
