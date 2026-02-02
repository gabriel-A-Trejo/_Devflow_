import Preview from "@/features/editor/Preview";
import { getTimeStamp } from "@/features/question/lib/getTimeStamp";
import { hasVoted } from "@/features/tags/actions/has-voted.action";
import Votes from "@/features/votes/components/votes";
import CompactCard from "@/shared/components/compact/compact-card";
import UserAvatar from "@/shared/components/navigation/navbar/userAvatar";
import ROUTES from "@/shared/constants/routes";
import type { Answer } from "@/shared/types/global";
import Link from "next/link";
import { Suspense } from "react";

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
}: Answer) => {
  const hasVotedPromise = hasVoted({ targetId: _id, targetType: "answer" });
  return (
    <CompactCard
      cardClassName="border-none p-0 bg-background shadow-none mb-20 "
      contentClassName="p-0 mt-5 "
      title={_id}
      titleClassName="sr-only  "
      headerClassName="hidden"
      content={
        <article className="">
          <span id={JSON.stringify(_id)} />

          <div className="flex items-start justify-between gap-4 mb-8 ">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <UserAvatar
                  id={author._id}
                  name={author.name}
                  imageUrl={author.image}
                  className="size-5 rounded-full"
                />

                <Link
                  href={ROUTES.PROFILE(author._id)}
                  className="font-semibold hover:text-muted-foreground transition-colors"
                >
                  {author.name ?? "Anonymous"}
                </Link>
              </div>

              <p className="text-sm whitespace-nowrap text-muted-foreground ml-7 sm:ml-0">
                <span className="max-sm:hidden">• </span>
                Answered {getTimeStamp(createdAt)}
              </p>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="answer"
                targetId={_id}
                hasVotedPromise={hasVotedPromise}
                upvotes={upvotes}
                downvotes={downvotes}
              />
            </Suspense>
          </div>

          <Preview content={content} />
        </article>
      }
    />
  );
};

export default AnswerCard;
