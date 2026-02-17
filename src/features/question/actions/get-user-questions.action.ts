import action from "@/shared/lib/handlers/action";
import type { GetUserQuestionsParams } from "@/shared/types/action";
import type {
  ActionResponses,
  ErrorResponse,
  Question as QuestionType,
} from "@/shared/types/global";
import { GetUserQuestionSchema } from "../schema/get-user-questions-schema";
import handleError from "@/shared/lib/handlers/errors";
import { Question } from "@/database";

export async function getUserQuestion(
  params: GetUserQuestionsParams,
): Promise<ActionResponses<{ questions: QuestionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const totalQuestion = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestion > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
