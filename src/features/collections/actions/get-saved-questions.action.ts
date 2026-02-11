"use server";

import { Collection } from "@/database";
import { PaginatedSearchSchema } from "@/features/search/schema/paginated-search-schema";
import action from "@/shared/lib/handlers/action";
import handleError from "@/shared/lib/handlers/errors";
import type {
  ActionResponses,
  Collection as CollectionType,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/shared/types/global";
import mongoose, { type PipelineStage } from "mongoose";

export async function getSavedQuestion(
  params: PaginatedSearchParams,
): Promise<ActionResponses<{ collection: CollectionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;
  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const sortOption: Record<string, Record<string, 1 | -1>> = {
    mostRecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostVoted: { "question.upvoted": -1 },
    mostViewed: { "question.views": -1 },
    mostAnswered: { "question.answers": -1 },
  };

  const sortCriteria: Record<string, 1 | -1> = sortOption[
    filter as keyof typeof sortOption
  ] ?? { "question.createdAt": -1 };

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push({ $sort: sortCriteria }, { $skip: skip }, { $limit: limit });
    pipeline.push({ $project: { question: 1, author: 1 } });

    const question = await Collection.aggregate(pipeline);

    const isNext = totalCount?.count > skip + question.length;

    return {
      success: true,
      data: { collection: JSON.parse(JSON.stringify(question)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
