import QuestionCard from "@/features/question/components/question-card";
import Search from "@/features/search";
import { getTagQuestion } from "@/features/tags/actions/get-tag-question.actions";
import DataRenderer from "@/shared/components/data-renderer";
import Filter from "@/shared/components/filters/Filter";
import { Heading } from "@/shared/components/header/heading";
import Pagination from "@/shared/components/pagination/Pagination";
import { TagQuestionFilters } from "@/shared/constants/filters";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_QUESTION } from "@/shared/constants/states";
import type { RouteParams } from "@/shared/types/global";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "Tag not found | DevFlow",
      description: "This tag does not exist on DevFlow.",
    };
  }

  const { success, data } = await getTagQuestion({
    tagId: id,
    page: 1,
    pageSize: 1,
  });

  if (!success || !data?.tags) {
    return {
      title: "Tag not found | DevFlow",
      description: "This tag does not exist on DevFlow.",
    };
  }

  const tagName = data.tags.name;
  const title = `Questions tagged "${tagName}" - DevFlow`;
  const description = `Browse questions and answers related to "${tagName}" on DevFlow.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const page = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTagQuestion({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags, questions, isNext } = data || {};

  return (
    <>
      <Heading>{tags?.name ?? "tag"}</Heading>
      <section className="mt-11">
        <Search
          route={ROUTES.TAG(id)}
          placeholder="Search by question..."
          otherClasses="flex-1"
        />
        <Filter filters={TagQuestionFilters} />
      </section>
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

      <Pagination
        page={page || 1}
        isNext={isNext || false}
        containerClasses="mt-10"
      />
    </>
  );
};

export default page;
