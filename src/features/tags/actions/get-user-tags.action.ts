"use server";

import action from "@/shared/lib/handlers/action";
import type { GetUserAnswerParams } from "@/shared/types/action";
import type {
  ActionResponses,
  Tags as TagsType,
  ErrorResponse,
} from "@/shared/types/global";
import handleError from "@/shared/lib/handlers/errors";
import { Answer, Question } from "@/database";
import { getUserTagsSchema } from "../schema/get-user-tags.schema";
import { PipelineStage, Types } from "mongoose";

export async function getUserTags(params: GetUserAnswerParams): Promise<
  ActionResponses<{
    tags: { _id: string; name: string; count: number }[];
  }>
> {
  const validationResult = await action({
    params,
    schema: getUserTagsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      {
        $group: { _id: "$tags", count: { $sum: 1 } },
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
