import { PaginatedSearchSchema } from "@/features/search/schema/paginated-search-schema";
import z from "zod";

export const GetAnswerSchema = PaginatedSearchSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});
