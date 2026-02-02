import { CreateVoteSchema } from "./create-vote-schema";

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});
