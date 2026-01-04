import Link from "next/link";

import { Badge } from "@/shared/components/ui";

import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import ROUTES from "@/shared/constants/routes";
import { getDeviconClassName } from "../lib/dev-icons";

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
};

export default TagCard;
