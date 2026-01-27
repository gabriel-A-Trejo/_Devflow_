import z from "zod";

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});
