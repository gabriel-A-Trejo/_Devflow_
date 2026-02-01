import z from "zod";
import { CreateVoteSchema } from "./create-vote-schema";

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});
