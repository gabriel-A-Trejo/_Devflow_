"use server";

import action from "@/shared/lib/handlers/action";
import type { DeleteUserAnswerParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { deleteUserAnswerSchema } from "../schema/delete-user-answer-schema";
import handleError from "@/shared/lib/handlers/errors";
import mongoose from "mongoose";
import { Answer, Question, Vote } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function deleteUserAnswer(
  params: DeleteUserAnswerParams,
): Promise<ActionResponses> {
  const validationResult = await action({
    params,
    schema: deleteUserAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { answerId } = validationResult.params!;
  const { user } = validationResult.session!;

  if (!user?.id) throw new Error("Unauthorized");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const answer = await Answer.findById(answerId)
      .select("author question")
      .session(session);
    if (!answer) throw new Error("Answer not found");

    if (answer.author.toString() !== user.id) throw new Error("Not authorized");

    await Promise.all([
      Question.findByIdAndUpdate(
        answer.question,
        { $inc: { answers: -1 } },
        { session },
      ),
      Vote.deleteMany(
        { actionId: answerId, actionType: "answer" },
        { session },
      ),
      Answer.findByIdAndDelete(answerId, { session }),
    ]);

    await session.commitTransaction();

    revalidatePath(ROUTES.PROFILE(user.id));
    return { success: true };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
