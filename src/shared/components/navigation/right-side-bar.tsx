"use client";

import TagCard from "@/features/tags/components/tag-card";
import ROUTES from "@/shared/constants/routes";
import { ChevronRight } from "lucide-react";

import Link from "next/link";
const hotQuestion = [
  {
    _id: "1",
    title: "How do custom hooks help reduce duplicated logic in React?",
  },
  {
    _id: "2",
    title: "When should you use React Router instead of Next.js routing?",
  },
  {
    _id: "3",
    title: "What problems does Redux solve in large JavaScript applications?",
  },
];

const popularTags = [
  { _id: "1", name: "react", questions: 300 },
  { _id: "2", name: "next.js", questions: 240 },
  { _id: "3", name: "javascript", questions: 520 },
];

const RightSideBar = () => {
  return (
    <aside className="no-scrollbar bg-background sticky right-0 top-0 flex  w-[350px] flex-col gap-6 h-screen  p-6 pt-25 max-xl:hidden">
      <section>
        <h3 className="font-bold">Top Questions</h3>
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
      </section>
      <section className="mt-16">
        <h3 className="font-bold">Popular Tags</h3>
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
      </section>
    </aside>
  );
};

export default RightSideBar;
