import Filter from "@/shared/components/filters/Filter";
import HomeFilter from "@/shared/components/filters/Filter";
import { getQuestions } from "@/features/question/actions/question.action";
import QuestionCard from "@/features/question/components/question-card";
import Search from "@/features/search";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import { buttonVariants } from "@/shared/components/ui/button";
import { HomePageFilters } from "@/shared/constants/filters";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_QUESTION } from "@/shared/constants/states";
import { cn } from "@/shared/lib/utils";

import Link from "next/link";
import Pagination from "@/shared/components/pagination/Pagination";

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

  const { questions, isNext } = data || {};

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
      <Filter filters={HomePageFilters} />

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
      <Pagination page={1} isNext={isNext || false} />
    </>
  );
};

export default Home;
