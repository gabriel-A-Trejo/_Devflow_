import { PaginatedSearchSchema } from "@/features/search/schema/paginated-search-schema";
import action from "@/shared/lib/handlers/action";
import handleError from "@/shared/lib/handlers/errors";

import type {
  ActionResponses,
  ErrorResponse,
  PaginatedSearchParams,
} from "@/shared/types/global";

import type { Model, QueryFilter, PopulateOptions } from "mongoose";

type SortMap = Record<string, Record<string, 1 | -1>>;

interface GenericPaginatedOptions<T> {
  model: Model<any>;
  params: PaginatedSearchParams;

  // Search
  searchableFields: string[];

  // Sorting
  sortMap: SortMap;
  defaultSort: string;

  // Query Enhancements
  populate?: (string | PopulateOptions)[];
  lean?: boolean;

  // Custom logic per model
  customFilter?: (
    filter: string | undefined,
    filterQuery: QueryFilter<any>,
  ) => {
    earlyReturn?: { results: T[]; isNext: boolean };
  } | void;
}

export async function genericPaginatedAction<T>({
  model,
  params,
  searchableFields,
  sortMap,
  defaultSort,
  populate = [],
  lean = true,
  customFilter,
}: GenericPaginatedOptions<T>): Promise<
  ActionResponses<{ results: T[]; isNext: boolean }>
> {
  // 1. Validate
  const validationResult = await action({
    params,
    schema: PaginatedSearchSchema,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  // 2. Params
  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  // 3. Build filter
  const filterQuery: QueryFilter<any> = {};

  if (query && searchableFields.length > 0) {
    filterQuery.$or = searchableFields.map((field) => ({
      [field]: { $regex: query, $options: "i" },
    }));
  }

  // 4. Custom model logic
  const customResult = customFilter?.(filter, filterQuery);
  if (customResult?.earlyReturn) {
    return {
      success: true,
      data: customResult.earlyReturn,
    };
  }

  // 5. Sorting
  const sortCriteria = sortMap[filter || ""] || sortMap[defaultSort];

  try {
    // 6. Count
    const total = await model.countDocuments(filterQuery);

    // 7. Query
    let queryBuilder = model
      .find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    // 8. Populate
    if (populate && populate.length > 0) {
      queryBuilder = queryBuilder.populate(populate);
    }

    // 9. Lean
    if (lean) {
      queryBuilder = queryBuilder.lean();
    }

    const results = (await queryBuilder) as T[];

    // 10. Pagination state
    const isNext = total > skip + results.length;

    return {
      success: true,
      data: {
        results: JSON.parse(JSON.stringify(results)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
