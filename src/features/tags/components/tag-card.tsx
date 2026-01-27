import Link from "next/link";

import { Badge } from "@/shared/components/ui";

import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import ROUTES from "@/shared/constants/routes";
import { getDeviconClassName, getTechDescription } from "../lib/dev-icons";
import CompactCard from "@/shared/components/compact/compact-card";
import { buttonVariants } from "@/shared/components/ui/button";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact = false,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);

  const Content = (
    <>
      <Badge
        className={cn(
          "subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase cursor-pointer",
          !remove && "hover:bg-muted", // only apply hover if NOT removed
        )}
        variant="secondary"
      >
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`} aria-hidden="true" />
          <span>{name}</span>
        </div>

        {remove && (
          <span>
            <X
              className="cursor-pointer hover:text-muted-foreground  size-3"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove?.();
              }}
            />
          </span>
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}</p>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button key={_id} type="button" className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link
        href={ROUTES.TAG(_id)}
        key={_id}
        className="flex justify-between gap-2 "
      >
        {Content}
      </Link>
    );
  }

  return (
    <CompactCard
      title={_id}
      titleClassName="sr-only"
      cardClassName="rounded-2xl  hover:shadow-lg transition-shadow duration-200 "
      headerClassName="hidden"
      content={
        <article className="flex flex-col w-full md:w-[220px] lg:w-[280px] ">
          <div className="flex items-center justify-between gap-3">
            {/* Tag Button */}
            <Link
              href={ROUTES.TAG(_id)}
              className={cn(
                buttonVariants({ variant: "default" }),
                "capitalize px-3 py-1.5 text-sm font-medium transition-scale hover:scale-110 duration-200 ",
              )}
            >
              {name}
            </Link>

            {/* Icon */}
            <i
              className={cn(iconClass, "text-2xl text-muted-foreground")}
              aria-hidden="true"
            />
          </div>

          {/* Description */}
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
            {iconDescription}
          </p>

          {/* Questions count */}
          {questions! > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="text-primary font-semibold mr-1">
                {questions}+
              </span>
              Questions
            </p>
          )}
        </article>
      }
    />
  );
};

export default TagCard;
