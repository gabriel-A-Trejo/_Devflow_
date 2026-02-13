import Filter from "@/shared/components/filters/Filter";
import Search from "@/features/search";
import { getTags } from "@/features/tags/actions/get-tag.actions";
import TagCard from "@/features/tags/components/tag-card";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import { TagFilters } from "@/shared/constants/filters";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_TAGS } from "@/shared/constants/states";
import type { RouteParams } from "@/shared/types/global";
import Pagination from "@/shared/components/pagination/Pagination";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query,
    filter,
  });

  const { tags, isNext } = data || {};

  return (
    <>
      <Heading>Tags</Heading>
      <section className="mt-11">
        <Search
          route={ROUTES.TAGS}
          placeholder="Search tag..."
          otherClasses="flex-1"
        />
      </section>
      <Filter filters={TagFilters} />

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4 ">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Tags;
