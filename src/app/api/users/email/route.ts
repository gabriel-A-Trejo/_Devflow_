import User from "@/database/user.model";
import handleError from "@/shared/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { UserSchema } from "@/shared/schema/user-schema";
import type { APIErrorResponse } from "@/shared/types/global";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    await dbConnect();
    const validatedData = UserSchema.partial().safeParse({ email });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");
    return success(user);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
