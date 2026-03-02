"use server";

import action from "@/shared/lib/handlers/action";
import type { GlobalSearchParams } from "@/shared/types/action";
import type { ErrorResponse } from "@/shared/types/global";
import { globalSearchSchema } from "../schema/global-search.schema";
import handleError from "@/shared/lib/handlers/errors";
import { Answer, Question, Tag, User } from "@/database";

export async function globalSearch(params: GlobalSearchParams) {
  try {
    const validationResult = await action({
      params,
      schema: globalSearchSchema,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { query, type } = validationResult.params!;
    const regexQuery = { $regex: query, $options: "i" };

    const results = [];

    const modelAndTypes = [
      {
        model: Question,
        searchField: "title",
        type: "question",
      },
      {
        model: Answer,
        searchField: "content",
        type: "answer",
      },
      {
        model: User,
        searchField: "name",
        type: "user",
      },
      {
        model: Tag,
        searchField: "name",
        type: "tag",
      },
    ];
    const typeLowerCase = type?.toLowerCase();
    const searchableTypes = ["question", "answer", "user", "tag"];

    if (!typeLowerCase || !searchableTypes.includes(typeLowerCase)) {
      for (const { model, searchField, type } of modelAndTypes) {
        const queryResults = await model
          .find({
            [searchField]: regexQuery,
          })
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answer containing "${query}`
                : item[searchField],
            type,
            id: type === "answer" ? item.question : item._id,
          })),
        );
      }
    } else {
      const modelInfo = modelAndTypes.find(
        (item) => item.type === typeLowerCase,
      );

      if (!modelInfo) throw new Error("Invalid search type");

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      results.push(
        ...queryResults.map((item) => ({
          title:
            type === "answer"
              ? `Answer containing "${query}`
              : item[modelInfo.searchField],
          type,
          id: type === "answer" ? item.question : item._id,
        })),
      );
    }

    return { success: true, data: JSON.parse(JSON.stringify(results)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
