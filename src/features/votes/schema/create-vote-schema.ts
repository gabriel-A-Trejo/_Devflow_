import z from "zod";

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required."),
  targetType: z.enum(["question", "answer"], "Invalid target type."),
  voteType: z.enum(["upvote", "downvote"], "Invalid vote type."),
});
