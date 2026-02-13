import { getTopQuestion } from "@/features/question/actions/top-question.action";
import TagCard from "@/features/tags/components/tag-card";
import ROUTES from "@/shared/constants/routes";
import { ChevronRight } from "lucide-react";

import Link from "next/link";
import DataRenderer from "../data-renderer";
import { getTopTag } from "@/features/tags/actions/get-top-tag.action";

const RightSideBar = async () => {
  const { success, data: hotQuestion, error } = await getTopQuestion();
  const {
    success: tagSuccess,
    data: popularTags,
    error: errorTags,
  } = await getTopTag();

  return (
    <aside className="no-scrollbar bg-background sticky right-0 top-0 flex  w-[350px] flex-col gap-6 h-screen  p-6 pt-25 max-xl:hidden">
      <section>
        <h3 className="font-bold">Top Questions</h3>
        <DataRenderer
          data={hotQuestion}
          empty={{
            title: "No question found",
            message: "No question have been asked yet.",
          }}
          success={success}
          error={error}
          render={(hotQuestion) => (
            <div className=" mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestion.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="cursor-pointer flex gap-7 justify-between hover:text-muted-foreground"
                >
                  <p>{title}</p>
                  <ChevronRight className="size-8" />
                </Link>
              ))}
            </div>
          )}
        />
      </section>
      <section className="mt-16">
        <h3 className="font-bold">Popular Tags</h3>
        <DataRenderer
          data={popularTags}
          success={tagSuccess}
          error={errorTags}
          empty={{
            title: "No tag found",
            message: "No tag have been created yet.",
          }}
          render={(popularTags) => (
            <div className=" mt-7 flex flex-col gap-4">
              {popularTags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </section>
    </aside>
  );
};

export default RightSideBar;
