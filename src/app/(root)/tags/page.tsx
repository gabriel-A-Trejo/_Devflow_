import Search from "@/features/search";
import { getTags } from "@/features/tags/actions/get-tag.actions";
import TagCard from "@/features/tags/components/tag-card";
import DataRenderer from "@/shared/components/data-renderer";
import { Heading } from "@/shared/components/header/heading";
import ROUTES from "@/shared/constants/routes";
import { EMPTY_TAGS } from "@/shared/constants/states";
import type { RouteParams } from "@/shared/types/global";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query,
    filter,
  });

  const { tags } = data || {};

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
    </>
  );
};

export default Tags;
