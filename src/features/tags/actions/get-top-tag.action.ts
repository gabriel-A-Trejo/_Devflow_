import { Tag } from "@/database";
import handleError from "@/shared/lib/handlers/errors";
import dbConnect from "@/shared/lib/mongoose";
import type {
  ActionResponses,
  ErrorResponse,
  Tags,
} from "@/shared/types/global";

export async function getTopTag(): Promise<ActionResponses<Tags[]>> {
  try {
    await dbConnect;
    const tags = await Tag.find().sort({ question: -1 }).limit(3);

    return { success: true, data: tags };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
