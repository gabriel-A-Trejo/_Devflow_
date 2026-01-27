import z from "zod";
import { AskQuestionSchema } from "./ask-a-question-schema";

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required."),
});
