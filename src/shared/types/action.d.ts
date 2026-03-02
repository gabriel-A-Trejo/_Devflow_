import { Session } from "./../../../node_modules/.pnpm/next-auth@5.0.0-beta.30_next@16.1.1_@opentelemetry+api@1.9.0_babel-plugin-react-compile_ba75525b9c7eb5470e8f9f476b31732d/node_modules/@auth/core/types.d";
import { action } from "@/shared/lib/handlers/action";
import { PaginatedSearchParams } from "./global";
import { IInteraction } from "@/database/interaction.model";
import mongoose from "mongoose";

interface UserBase {
  name: string;
  username: string;
  email: string;
  image?: string;
}

interface WithQuestionId {
  questionId: string;
}

interface WithUserId {
  userId: string;
}

interface BaseVoteParams {
  targetId: string;
  targetType: "question" | "answer";
}

interface SignWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: UserBase;
}

interface AuthCredentials extends Omit<UserBase, "image"> {
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams extends WithQuestionId {}

interface GetTagQuestionParams extends PaginatedSearchParams {
  tagId: string;
}

interface IncrementViewsParams extends WithQuestionId {}

interface CreateAnswerParams extends WithQuestionId {
  content: string;
}

interface GetAnswerParams extends PaginatedSearchParams, WithQuestionId {}

interface CreateVotesParams extends BaseVoteParams {
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVotesParams {
  change: 1 | -1;
}

type HasVotedParams = BaseVoteParams;

interface HasVotedResponse {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

interface CollectionBasedParams extends WithQuestionId {}

interface GetUserParams extends WithUserId {}

interface GetUserQuestionsParams extends PaginatedSearchParams, WithUserId {}

interface GetUserAnswerParams extends PaginatedSearchParams, WithUserId {}

interface GetUserTagParams extends WithUserId {}

interface DeleteUserQuestionParams extends WithQuestionId {}

interface DeleteUserAnswerParams {
  answerId: string;
}

interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer";
}

interface UpdateReputationParams {
  interaction: IInteraction;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

interface getFilterJobParams {
  query: string;
  page: string;
  location: string;
}

interface GlobalSearchParams {
  query: string;
  type: string | null;
}

interface updateProfileParams {
  name: string;
  username: string;
  portfolio?: string;
  location: string;
}
