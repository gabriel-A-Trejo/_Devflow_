import { PaginatedSearchParams } from "./global";

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

interface GetTagQuestionParams extends Omit<PaginatedSearchParams, "filter"> {
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

interface UpdateVoteCountParams extends BaseVoteParams {
  change: 1 | -1;
}

type HasVotedParams = BaseVoteParams;

interface HasVotedResponse {
  hasUpVoted: boolean;
  hasDownVoted: boolean;
}

interface CollectionBasedParams extends WithQuestionId {}

interface GetUserParams extends WithUserId {}

interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query" | "filter" | "sort">,
    WithUserId {}

interface GetUserAnswerParams extends PaginatedSearchParams, WithUserId {}

interface GetUserTagParams extends WithUserId {}
