"use server";

import { Interaction, Question } from "@/database";
import type { RecommendationParams } from "@/shared/types/action";
import { type QueryFilter, Types } from "mongoose";

export async function getRecommendationQuestions({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) {
  const interaction = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "question",
    action: { $in: ["view", "upvote", "bookmark"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interaction.map((i) => i.actionId);
  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds },
  }).select("tags");

  const allTags = interactedQuestions
    .flatMap((q) => (Array.isArray(q.tags) ? q.tags : []))
    .map((tag: Types.ObjectId) => tag.toString());

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: QueryFilter<typeof Question> = {
    _id: { $nin: interactedQuestionIds },
    author: new Types.ObjectId(userId),
    tags: { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) },
  };

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query }, $options: "i" },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const question = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    questions: JSON.parse(JSON.stringify(question)),
    isNext: total > skip + question.length,
  };
}
