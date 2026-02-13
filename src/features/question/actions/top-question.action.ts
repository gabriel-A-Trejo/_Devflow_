import { Question } from "@/database";
import handleError from "@/shared/lib/handlers/errors";
import dbConnect from "@/shared/lib/mongoose";
import type {
  ActionResponses,
  ErrorResponse,
  Question as QuestionType,
} from "@/shared/types/global";

export async function getTopQuestion(): Promise<
  ActionResponses<QuestionType[]>
> {
  try {
    await dbConnect();

    const question = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(3);

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
