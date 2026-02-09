"use server";

import action from "@/shared/lib/handlers/action";
import type { CollectionBasedParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { CollectionBaseSchema } from "../schema/collection-base-schema";
import handleError from "@/shared/lib/handlers/errors";
import { Collection, Question } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function toggleSaveQuestion(
  params: CollectionBasedParams,
): Promise<ActionResponses<{ isSaved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection.id);

      return { success: true, data: { isSaved: false } };
    }

    await Collection.create({ question: questionId, author: userId });
    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true, data: { isSaved: true } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
