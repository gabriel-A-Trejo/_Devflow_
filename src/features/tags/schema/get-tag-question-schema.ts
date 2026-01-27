import { PaginatedSearchSchema } from "@/features/search/schema/paginated-search-schema";
import z from "zod";

export const GetTagQuestionSchema = PaginatedSearchSchema.extend({
  tagId: z.string().min(1, "Tag ID is required"),
});
