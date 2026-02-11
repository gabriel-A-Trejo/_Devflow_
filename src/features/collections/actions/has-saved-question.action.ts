"use server";

import action from "@/shared/lib/handlers/action";
import type { CollectionBasedParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { CollectionBaseSchema } from "../schema/collection-base-schema";
import handleError from "@/shared/lib/handlers/errors";
import { Collection } from "@/database";

export async function hasSavedQuestion(
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
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return { success: true, data: { isSaved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
