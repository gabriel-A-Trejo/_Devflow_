"use server";

import action from "@/shared/lib/handlers/action";
import type { GetUserAnswerParams } from "@/shared/types/action";
import type {
  ActionResponses,
  Answer as AnswerType,
  ErrorResponse,
} from "@/shared/types/global";
import handleError from "@/shared/lib/handlers/errors";
import { Answer } from "@/database";
import { GetUserAnswerSchema } from "../schema/get-user-answer-schema";

export async function getUserAnswers(
  params: GetUserAnswerParams,
): Promise<ActionResponses<{ answers: AnswerType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetUserAnswerSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  try {
    const [totalAnswers, answers] = await Promise.all([
      Answer.countDocuments({ author: userId }),
      Answer.find({ author: userId })
        .populate("author", "name image")
        .skip(skip)
        .limit(limit),
    ]);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
