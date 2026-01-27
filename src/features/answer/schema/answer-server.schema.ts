import z from "zod";

export const AnswerServerSchema = z.object({
  questionId: z.string().min(1, "Question ID is required."),
  content: z.string().min(100, "Answer has to have more than 100 character."),
});
