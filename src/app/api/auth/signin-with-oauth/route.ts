import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/shared/lib/handlers/errors";
import { ValidationError } from "@/shared/lib/http-errors";
import dbConnect from "@/shared/lib/mongoose";
import { success } from "@/shared/lib/response";
import { SignInWithOAuthSchema } from "@/shared/schema/sign-in-with-oauth-schema";
import type { APIErrorResponse } from "@/shared/types/global";
import mongoose from "mongoose";
import slugify from "slugify";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session },
      );
    } else {
      const updateData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updateData.name = name;
      if (existingUser.image !== image) updateData.image = image;

      if (Object.keys(updateData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updateData },
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    return success();
  } catch (err: unknown) {
    await session.abortTransaction();
    return handleError(err, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
