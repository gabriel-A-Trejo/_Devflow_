import User from "@/database/user.model";
import { HTTP_STATUS } from "@/shared/constants/http-status";
import handleError from "@/shared/lib/handlers/errors";
import { ValidationError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { UserSchema } from "@/shared/schema/user-schema";
import type { APIErrorResponse } from "@/shared/types/global";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return success(users);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;
    const existingUser = await User.findOne({ email });

    if (existingUser) throw new Error("User already exist");
    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username already exist");

    const newUser = await User.create(validatedData.data);

    return success(newUser, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
