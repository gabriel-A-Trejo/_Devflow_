import { auth } from "@/auth";
import HomeFilter from "@/features/filters/components/HomeFilter";
import { getQuestions } from "@/features/question/actions/question.action";
import QuestionCard from "@/features/question/components/question-card";
import Search from "@/features/search";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import { buttonVariants } from "@/shared/components/ui/button";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_QUESTION } from "@/shared/constants/states";
import { cn } from "@/shared/lib/utils";
import type { Question } from "@/shared/types/global";

import Link from "next/link";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};

  // const filteredQuestions = questions.filter((question) => {
  //   const matchesQuery = question.title
  //     .toLowerCase()
  //     .includes(query.toLowerCase());
  //   const matchesFilter = filter
  //     ? question.tags.some(
  //         (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
  //       )
  //     : true;
  //   return matchesFilter && matchesQuery;
  // });

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <Heading> All Questions </Heading>
        <Link
          href={ROUTES.ASK_QUESTION}
          className={cn(
            buttonVariants({ variant: "default" }),
            "min-h-[46px] py-3",
          )}
        >
          Ask a Question
        </Link>
      </section>
      <section className="mt-11">
        <Search
          route={ROUTES.HOME}
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
      {/* {success ? (
        <div className="mt-10 flex w-full flex-col gap-6 ">
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <div className="mt-10 flex w-full items-center justify-center">
              <p className="text">No questions found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center">
          <p className="text">
            {error?.message || "Failed to fetch questions"}
          </p>
        </div>
      )} */}
    </>
  );
};

export default Home;
