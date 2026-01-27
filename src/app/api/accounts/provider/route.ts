import Account from "@/database/account.model";

import handleError from "@/shared/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { AccountSchema } from "@/shared/schema/account-schema";

import type { APIErrorResponse } from "@/shared/types/global";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    await dbConnect();
    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");
    return success(account);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
