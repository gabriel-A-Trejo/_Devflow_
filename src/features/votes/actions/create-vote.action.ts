"use server";

import action from "@/shared/lib/handlers/action";
import type { CreateVotesParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { CreateVoteSchema } from "../schema/create-vote-schema";
import handleError from "@/shared/lib/handlers/errors";
import mongoose from "mongoose";
import { Vote } from "@/database";
import { updateVoteCount } from "./update-vote.action";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function createVote(
  params: CreateVotesParams,
): Promise<ActionResponses> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponses;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("User not found")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        await updateVoteCount(
          { targetId, targetType, voteType: existingVote.voteType, change: -1 },
          session,
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session,
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
            change: 1,
          },
        ],
        {
          session,
        },
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session,
      );
    }

    await session.commitTransaction();
    session.endSession();

    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
      session.endSession();
    }
    return handleError(error) as ErrorResponse;
  }
}
