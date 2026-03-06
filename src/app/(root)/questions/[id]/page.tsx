import { getAnswers } from "@/features/answer/actions/get-answer.action";
import AllAnswers from "@/features/answer/components/all-answers";
import AnswerForm from "@/features/answer/components/answer-form";
import { hasSavedQuestion } from "@/features/collections/actions/has-saved-question.action";
import SaveQuestion from "@/features/collections/components/save-question";
import Preview from "@/shared/components/editor/Preview";
import {
  getQuestionById,
  incrementViews,
} from "@/features/question/actions/question.action";
import { Metric } from "@/features/question/components/metric";
import { formatNumber } from "@/features/question/lib/formatNumber";
import { getTimeStamp } from "@/features/question/lib/getTimeStamp";
import { hasVoted } from "@/features/tags/actions/has-voted.action";
import TagCard from "@/features/tags/components/tag-card";
import Votes from "@/features/votes/components/votes";
import { Heading } from "@/shared/components/header/heading";
import UserAvatar from "@/shared/components/navigation/navbar/userAvatar";

import ROUTES from "@/shared/constants/routes";
import type { RouteParams, Tags } from "@/shared/types/global";
import { Clock3, Eye, MessageCircle } from "lucide-react";

import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";
import SavePlaceholder from "@/features/question/components/save-placeholder";
import VotePlaceholder from "@/features/votes/components/vote-placeholder";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestionById({ questionId: id });

  if (!success || !question) {
    return {
      title: "Question not found",
      description: "This question does not exist",
    };
  }

  const description = question.content.slice(0, 160);

  return {
    title: question.title,
    description,
    openGraph: {
      title: question.title,
      description,
      type: "article",
      authors: [question.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description,
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const [{ id }, { page, pageSize, filter }] = await Promise.all([
    params,
    searchParams,
  ]);
  const [
    { success, data: question },
    { success: areAnswerLoaded, data: answerResult, error: answersError },
  ] = await Promise.all([
    getQuestionById({ questionId: id }),
    getAnswers({
      questionId: id,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      filter,
    }),
  ]);
  after(async () => [await incrementViews({ questionId: id })]);

  if (!success || !question) return redirect("/404");

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  const { author, createdAt, answers, views, tags, content, title } = question;

  return (
    <>
      <div className="flex-start w-full flex-col ">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              imageUrl={author.image}
              name={author.name}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="font-semibold">{author.name}</p>
            </Link>
          </div>
          <div className="flex justify-end gap-4">
            <Suspense fallback={<VotePlaceholder />}>
              <Votes
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetType="question"
                authorId={author._id}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<SavePlaceholder />}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div>
        </div>
        <Heading className="mt-1"> {title} </Heading>
        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            icon={Clock3}
            value={` asked ${getTimeStamp(createdAt)}`}
            title={""}
            textStyles={"text-muted-foreground"}
            titleStyles="max-sm:hidden"
          />
          <Metric
            icon={MessageCircle}
            value={formatNumber(answers)}
            title={""}
            textStyles={"text-muted-foreground"}
            titleStyles="max-sm:hidden"
          />
          <Metric
            icon={Eye}
            value={formatNumber(views)}
            title={""}
            textStyles={"text-muted-foreground"}
            titleStyles="max-sm:hidden"
          />
        </div>
      </div>
      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tags) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answerResult?.isNext || false}
          data={answerResult?.answer}
          success={areAnswerLoaded}
          error={answersError}
          totalAnswers={answerResult?.totalAnswers!}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
