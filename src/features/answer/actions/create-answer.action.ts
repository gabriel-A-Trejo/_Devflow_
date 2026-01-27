"use server";

import type { IAnswerDoc } from "@/database/answer.model";
import action from "@/shared/lib/handlers/action";
import type { CreateAnswerParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { AnswerServerSchema } from "../schema/answer-server.schema";
import handleError from "@/shared/lib/handlers/errors";
import mongoose from "mongoose";
import { Answer, Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function CreateAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponses<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { content, questionId } = validationResult?.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Question not found");

    const [newAnswer] = await Answer.create(
      [{ author: userId, question: questionId, content }],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
