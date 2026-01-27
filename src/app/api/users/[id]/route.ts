import User from "@/database/user.model";
import handleError from "@/shared/lib/handlers/errors";
import { NotFoundError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { UserSchema } from "@/shared/schema/user-schema";
import type { APIErrorResponse } from "@/shared/types/global";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User");
    return success(user);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");
    return success(user);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.partial().parse(body);
    const updateUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });
    if (!updateUser) throw new NotFoundError("User");
    return success(updateUser);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
