import { Vote } from "@/database";
import { HasVotedSchema } from "@/features/votes/schema/has-voted-schema";
import action from "@/shared/lib/handlers/action";
import handleError from "@/shared/lib/handlers/errors";
import type { HasVotedParams, HasVotedResponse } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponses<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;
  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote)
      return {
        success: false,
        data: { hasUpVoted: false, hasDownVoted: false },
      };

    return {
      success: true,
      data: {
        hasUpVoted: vote.voteType === "upvote",
        hasDownVoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
