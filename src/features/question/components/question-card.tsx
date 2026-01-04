import CompactCard from "@/shared/components/compact/compact-card";
import { getTimeStamp } from "../lib/getTimeStamp";
import Link from "next/link";
import ROUTES from "@/shared/constants/routes";
import TagCard from "@/features/tags/components/tag-card";
import { Metric } from "./metric";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { formatNumber } from "../lib/formatNumber";

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
}: Props) => {
  return (
    <CompactCard
      title={title}
      titleClassName="sr-only  "
      headerClassName="hidden"
      content={
        <section className="flex flex-col p-1.5">
          <span className="sm:hidden text-xs text-muted-foreground">
            {getTimeStamp(createdAt)}
          </span>
          <Link
            href={ROUTES.QUESTION(_id)}
            className="hover:text-muted-foreground text-lg font-bold line-clamp-1 cursor-pointer mt-1.5"
          >
            {title}
          </Link>
          <div className="flex gap-2 mt-5 flex-wrap">
            {tags.map((tag: Tags) => (
              <TagCard
                key={tag._id}
                _id={tag._id as string}
                name={tag.name}
                compact
              />
            ))}
          </div>
          <section className="flex justify-between items-center gap-4 flex-wrap mt-6">
            <Metric
              imgUrl={author.image}
              alt={author.name}
              value={author.name}
              title={` • asked ${getTimeStamp(createdAt)}`}
              href={ROUTES.PROFILE(author._id)}
              titleStyles="hidden sm:block"
              textStyles="font-medium"
            />

            <div className="flex items-center gap-4  ">
              <Metric
                icon={ThumbsUp}
                value={formatNumber(upvotes)}
                title=" Votes"
                textStyles="font-med"
              />

              <Metric
                icon={MessageCircle}
                value={formatNumber(answers)}
                title=" Answers"
                textStyles="small-medium text-dark400_light800"
              />

              <Metric
                icon={Eye}
                value={formatNumber(views)}
                title=" Views"
                textStyles="small-medium text-dark400_light800"
              />
            </div>
          </section>
        </section>
      }
    />
  );
};

export default QuestionCard;
