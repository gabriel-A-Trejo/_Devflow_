"use server";

import action from "@/shared/lib/handlers/action";
import handleError from "@/shared/lib/handlers/errors";
import type { updateProfileParams } from "@/shared/types/action";
import type {
  ActionResponses,
  ErrorResponse,
  User as UserType,
} from "@/shared/types/global";
import { updateUserProfileSchema } from "../schema/update-user-profile.schema";
import { NotFoundError } from "@/shared/lib/http-errors";
import { User } from "@/database";
import { revalidatePath } from "next/cache";
import ROUTES from "@/shared/constants/routes";

export async function updateUserProfile(
  params: updateProfileParams,
): Promise<ActionResponses<{ user: UserType }>> {
  try {
    const validationResult = await action({
      params,
      schema: updateUserProfileSchema,
      authorize: true,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }
    const userId = validationResult.session?.user?.id;
    console.log(userId);

    if (!userId) throw new NotFoundError("User");
    const user = await User.findByIdAndUpdate(userId, params, { new: true });
    revalidatePath(ROUTES.PROFILE(userId));
    return { success: true, data: { user: JSON.parse(JSON.stringify(user)) } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
