"use server";

import action from "@/shared/lib/handlers/action";
import type { GetUserParams } from "@/shared/types/action";
import type {
  ActionResponses,
  BadgeCounts,
  ErrorResponse,
} from "@/shared/types/global";
import { getUserSchema } from "../schema/get-user-schema";
import handleError from "@/shared/lib/handlers/errors";
import { Types } from "mongoose";
import { Answer, Question } from "@/database";
import { assignBadges } from "../lib/assignBadge";

export async function getUserStats(params: GetUserParams): Promise<
  ActionResponses<{
    totalQuestions: number;
    totalAnswer: number;
    badges: BadgeCounts;
  }>
> {
  const validationResult = await action({ params, schema: getUserSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const [questionStats] = await Question.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: userId,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          views: { $sum: "$views" },
        },
      },
    ]);

    const [answerStats] = await Answer.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: userId,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const questionCount = questionStats?.count ?? 0;
    const questionUpvotes = questionStats?.upvotes ?? 0;
    const questionViews = questionStats?.views ?? 0;
    const answerCount = answerStats?.count ?? 0;
    const answerUpvotes = answerStats?.upvotes ?? 0;

    const badges = assignBadges({
      criteria: [
        { type: "ANSWER_COUNT", count: answerCount },
        { type: "QUESTION_COUNT", count: questionCount },
        { type: "QUESTION_UPVOTES", count: questionUpvotes },
        { type: "ANSWER_UPVOTES", count: answerUpvotes },
        { type: "TOTAL_VIEWS", count: questionViews },
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionCount,
        totalAnswer: answerCount,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
