"use server";

import type { IInteractionDoc } from "@/database/interaction.model";
import action from "@/shared/lib/handlers/action";
import type { CreateInteractionParams } from "@/shared/types/action";
import type { ActionResponses, ErrorResponse } from "@/shared/types/global";
import { CreateInteractionSchema } from "../schema/create-interaction-schema";
import handleError from "@/shared/lib/handlers/errors";
import mongoose from "mongoose";
import Interaction from "@/database/interaction.model";
import { updateReputation } from "./update-reputation.action";

export async function createInteraction(
  params: CreateInteractionParams,
): Promise<ActionResponses<IInteractionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    action: actionType,
    actionId,
    actionTarget,
    authorId, // person who owns the content (question/answer)
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interaction] = await Interaction.create(
      [
        {
          user: userId,
          action: actionType,
          actionId,
          actionType: actionTarget,
        },
      ],
      { session },
    );

    // Update reputation for both the performer and the content author
    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
