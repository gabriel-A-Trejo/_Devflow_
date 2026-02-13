import { getSavedQuestion } from "@/features/collections/actions/get-saved-questions.action";
import Filter from "@/shared/components/filters/Filter";
import QuestionCard from "@/features/question/components/question-card";
import Search from "@/features/search";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import { CollectionFilters } from "@/shared/constants/filters";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_QUESTION } from "@/shared/constants/states";
import Pagination from "@/shared/components/pagination/Pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Collections = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getSavedQuestion({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collection, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        <Heading> Saved Question </Heading>
      </section>
      <section className="mt-11">
        <Search
          route={ROUTES.COLLECTIONS}
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <Filter filters={CollectionFilters} />

      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTION}
        render={(collection) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Collections;
