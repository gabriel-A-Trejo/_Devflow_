import z from "zod";

export const AnswerSchema = z.object({
  content: z.string().min(100, "Answer has to have more than 100 character."),
});
