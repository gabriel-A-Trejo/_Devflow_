"use server";

import action from "@/shared/lib/handlers/action";
import type { GetUserParams } from "@/shared/types/action";
import type {
  ActionResponses,
  ErrorResponse,
  User as UserType,
} from "@/shared/types/global";
import { getUserSchema } from "../schema/get-user-schema";
import handleError from "@/shared/lib/handlers/errors";
import { Answer, Question, User } from "@/database";

export async function getUser(params: GetUserParams): Promise<
  ActionResponses<{
    user: UserType;
    totalQuestions: number;
    totalAnswers: number;
  }>
> {
  const validationResult = await action({
    params,
    schema: getUserSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { userId } = params;

  try {
    const [user, totalQuestions, totalAnswers] = await Promise.all([
      User.findById(userId),
      Question.countDocuments({ author: userId }),
      Answer.countDocuments({ author: userId }),
    ]);

    if (!user) throw new Error("User not Found");

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
