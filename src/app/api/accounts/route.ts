import Account from "@/database/account.model";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import handleError from "@/shared/lib/handlers/errors";
import { ForbiddenError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { AccountSchema } from "@/shared/schema/account-schema";
import type { APIErrorResponse } from "@/shared/types/global";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();
    return success(accounts);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = AccountSchema.parse(body);

    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });

    if (existingAccount)
      throw new ForbiddenError(
        "An account with the same provider already exists.",
      );

    const newAccount = await Account.create(validatedData);

    return success(newAccount, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
