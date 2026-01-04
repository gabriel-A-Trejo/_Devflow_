import HomeFilter from "@/features/filters/components/HomeFilter";
import QuestionCard from "@/features/question/components/question-card";
import Search from "@/features/search";
import { Heading } from "@/shared/components/header/heading";
import { buttonVariants } from "@/shared/components/ui/button";
import ROUTES from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

import Link from "next/link";

const questions: Question[] = [
  {
    _id: "1",
    title: "How do I improve performance in a React application?",
    tags: [
      { _id: "1", name: "React" },
      { _id: "2", name: "Performance" },
    ],
    author: {
      _id: "1",
      name: "Alice Johnson",
      image:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3000&auto=format&fit=crop",
    },
    upvotes: 42,
    downvotes: 3,
    answers: 8,
    views: 520,
    createdAt: new Date("2024-10-27"),
  },

  {
    _id: "2",
    title: "What is the difference between SQL and NoSQL databases?",
    tags: [
      { _id: "3", name: "Databases" },
      { _id: "4", name: "Backend" },
    ],
    author: {
      _id: "2",
      name: "Michael Chen",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=3000&auto=format&fit=crop",
    },
    upvotes: 31,
    downvotes: 1,
    answers: 12,
    views: 880,
    createdAt: new Date("2024-11-02"),
  },

  {
    _id: "3",
    title: "How does TypeScript improve large-scale applications?",
    tags: [
      { _id: "5", name: "TypeScript" },
      { _id: "6", name: "Architecture" },
    ],
    author: {
      _id: "3",
      name: "Sophie Martinez",
      image:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=3000&auto=format&fit=crop",
    },
    upvotes: 67,
    downvotes: 4,
    answers: 19,
    views: 1340,
    createdAt: new Date("2024-10-15"),
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const Home = async ({ searchParams }: SearchParams) => {
  const { query = "", filter = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) => {
    const matchesQuery = question.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter
      ? question.tags.some(
          (tag) => tag.name.toLowerCase() === filter.toLowerCase(),
        )
      : true;
    return matchesFilter && matchesQuery;
  });

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
      <div className="mt-10 flex w-full flex-col gap-6 ">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default Home;
