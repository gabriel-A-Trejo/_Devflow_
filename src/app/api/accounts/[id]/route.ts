import Account from "@/database/account.model";
import handleError from "@/shared/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { AccountSchema } from "@/shared/schema/account-schema";
import type { APIErrorResponse } from "@/shared/types/global";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();
    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");
    return success(account);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");
    return success(account);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!updatedAccount) throw new NotFoundError("Account");
    return success(updatedAccount);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
