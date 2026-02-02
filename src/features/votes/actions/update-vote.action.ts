"use server";

import action from "@/shared/lib/handlers/action";
import type { UpdateVoteCountParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import handleError from "@/shared/lib/handlers/errors";
import type { ClientSession } from "mongoose";
import { Answer, Question } from "@/database";
import { UpdateVoteCountSchema } from "../schema/update-vote-count-schema";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponses> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponses;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvote" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      {
        $inc: { [voteField]: change },
      },
      { new: true, session },
    );

    if (!result)
      return handleError(
        new Error("Failed to update vote count"),
      ) as ErrorResponse;

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
