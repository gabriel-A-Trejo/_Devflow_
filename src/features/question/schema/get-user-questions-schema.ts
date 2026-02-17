import { PaginatedSearchSchema } from "@/features/search/schema/paginated-search-schema";
import z from "zod";

export const GetUserQuestionSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, "User Id is required"),
});
