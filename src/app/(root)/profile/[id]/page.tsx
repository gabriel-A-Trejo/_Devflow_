import { auth } from "@/auth";
import { getUser } from "@/features/user/actions/get-user-details";
import { getUserStats } from "@/features/user/actions/get-user-stats.action";
import ProfileLink from "@/features/user/components/profile-link";
import UserAvatar from "@/shared/components/navigation/navbar/userAvatar";
import type { RouteParams } from "@/shared/types/global";
import { notFound } from "next/navigation";

import dayjs from "dayjs";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button";

import { CalendarDays, Link as LinkLucid, MapPin } from "lucide-react";
import Stats from "@/features/user/components/stats";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui";
import { getUserQuestion } from "@/features/question/actions/get-user-questions.action";
import DataRenderer from "@/shared/components/data-renderer";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/shared/constants/states";
import QuestionCard from "@/features/question/components/question-card";
import Pagination from "@/shared/components/pagination/Pagination";
import { getUserAnswers } from "@/features/answer/actions/get-user-answer.action";
import AnswerCard from "@/features/answer/components/answer-card";
import { getUserTags } from "@/features/tags/actions/get-user-tags.action";
import TagCard from "@/features/tags/components/tag-card";
import ROUTES from "@/shared/constants/routes";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "User not found | DevFlow",
      description: "This developer profile does not exist on DevFlow.",
    };
  }

  const { success, data } = await getUser({ userId: id });

  if (!success || !data?.user) {
    return {
      title: "User not found | DevFlow",
      description: "This developer profile does not exist on DevFlow.",
    };
  }

  const { name, username, bio } = data.user;
  const title = `${name} (@${username}) - DevFlow Profile`;
  const description =
    bio?.slice(0, 160) ||
    `View ${name}'s questions, answers and activity on DevFlow.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const Profile = async ({ params, searchParams }: RouteParams) => {
  const [{ id }, { page: rawPage, pageSize: rawPageSize }] = await Promise.all([
    params,
    searchParams,
  ]);
  const page = Number(rawPage) || 1;
  const pageSize = Number(rawPageSize) || 10;

  if (!id) notFound();

  const [
    loggedInUser,
    userRes,
    userQuestionsRes,
    userAnswersRes,
    userTopTagsRes,
    userStatsRes,
  ] = await Promise.all([
    auth(),
    getUser({ userId: id }),
    getUserQuestion({ userId: id, page, pageSize }),
    getUserAnswers({ userId: id, page, pageSize }),
    getUserTags({ userId: id }),
    getUserStats({ userId: id }),
  ]);

  const { user } = userRes.data!;
  const { questions, isNext: hasMoreQuestions } = userQuestionsRes.data!;
  const { answers, isNext: hasMoreAnswers } = userAnswersRes.data!;
  const { tags } = userTopTagsRes.data!;
  const { data: userStats } = userStatsRes;

  const { _id, name, image, username, portfolio, location, createdAt, bio } =
    user;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />
          <div className="mt-3">
            <h2 className="font-bold text-2xl">{name}</h2>
            <p className="text-muted-foreground">@{username}</p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  icon={LinkLucid}
                  href={portfolio}
                  title="portfolio"
                />
              )}
              {location && <ProfileLink icon={MapPin} title={location} />}
              <ProfileLink
                icon={CalendarDays}
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>

            {bio && <p className="mt-8">{bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === id && (
            <Link
              href={ROUTES.EDITPROFILE}
              className={cn(
                buttonVariants({ variant: "default" }),
                "px-4 py-3",
              )}
            >
              Edit Profile
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={userStats?.totalQuestions ?? 0}
        totalAnswers={userStats?.totalAnswer ?? 0}
        badges={userStats?.badges ?? { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation ?? 0}
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>

          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              data={questions}
              empty={EMPTY_QUESTION}
              success={userQuestionsRes.success}
              error={userQuestionsRes.error}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={
                        loggedInUser?.user?.id === question.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>

          <TabsContent value="answers" className="flex w-full flex-col gap-2">
            <DataRenderer
              data={answers}
              empty={EMPTY_ANSWERS}
              success={userAnswersRes.success}
              error={userAnswersRes.error}
              render={(answers) => (
                <div className="flex w-full flex-col ">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-6 sm:px-11"
                      showReadMore
                      showActionBtns={
                        loggedInUser?.user?.id === answer.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>

        <aside className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="font-bold text-xl">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              data={tags}
              empty={EMPTY_ANSWERS}
              success={userTopTagsRes.success}
              error={userTopTagsRes.error}
              render={(tags) => (
                <div className="mt-3 flex flex-col w-full gap-4">
                  {tags.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </aside>
      </section>
    </>
  );
};

export default Profile;
