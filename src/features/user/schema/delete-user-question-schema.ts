import z from "zod";

export const DeleteUserQuestionSchema = z.object({
  questionId: z.string().min(1, "Question Id is required."),
});
