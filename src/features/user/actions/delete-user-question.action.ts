"use server";

import type { DeleteUserQuestionParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { DeleteUserQuestionSchema } from "../schema/delete-user-question-schema";
import handleError from "@/shared/lib/handlers/errors";
import action from "@/shared/lib/handlers/action";
import mongoose from "mongoose";
import {
  Answer,
  Collection,
  Question,
  Tag,
  TagQuestion,
  Vote,
} from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function DeleteUserQuestion(
  params: DeleteUserQuestionParams,
): Promise<ActionResponses> {
  const validationResult = await action({
    params,
    schema: DeleteUserQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;
  const { user } = validationResult.session!;
  const session = await mongoose.startSession();
  if (!user) throw new Error("Unauthorized");

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found!");

    if (question.author.toString() !== user.id)
      throw new Error("Not authorized");

    const answers = await Answer.find({ question: questionId })
      .select("_id")
      .session(session);

    const answerIds = answers.map((a) => a._id);

    await Promise.all([
      Collection.deleteMany({ question: questionId }, { session }),
      TagQuestion.deleteMany({ question: questionId }, { session }),
      Vote.deleteMany(
        { actionId: questionId, actionType: "question" },
        { session },
      ),
      answerIds.length > 0
        ? Vote.deleteMany(
            { actionId: { $in: answerIds }, actionType: "answer" },
            { session },
          )
        : Promise.resolve(),
      Answer.deleteMany({ question: questionId }, { session }),

      question.tags.length > 0
        ? Tag.updateMany(
            { _id: { $in: question.tags } },
            { $inc: { questions: -1 } },
            { session },
          )
        : Promise.resolve(),
    ]);

    if (question.tags.length > 0) {
      await Tag.deleteMany(
        {
          _id: { $in: question.tags },
          questions: { $lte: 0 }, // catches 0 and protects against bugs (-1)
        },
        { session },
      );
    }

    await Question.findByIdAndDelete(questionId, { session });
    await session.commitTransaction();

    revalidatePath(ROUTES.PROFILE(user.id!));

    return { success: true };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
