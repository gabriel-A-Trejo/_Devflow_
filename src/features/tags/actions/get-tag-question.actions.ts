"use server";

import { Question, Tag } from "@/database";

import action from "@/shared/lib/handlers/action";
import handleError from "@/shared/lib/handlers/errors";
import type { GetTagQuestionParams } from "@/shared/types/action";
import type {
  ActionResponses,
  ErrorResponse,
  Question as QuestionType,
  Tags,
} from "@/shared/types/global";
import type { QueryFilter } from "mongoose";
import { GetTagQuestionSchema } from "../schema/get-tag-question-schema";

export async function getTagQuestion(
  params: GetTagQuestionParams,
): Promise<
  ActionResponses<{ tags: Tags; questions: QuestionType[]; isNext: boolean }>
> {
  const validationResult = await action({
    params,
    schema: GetTagQuestionSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { tagId, page = 1, pageSize = 10, query } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");
    const filterQuery: QueryFilter<typeof Question> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }
    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .select("_id views answers upvotes downvotes author createdAt")
      .populate([{ path: "author", select: "name image" }])
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
