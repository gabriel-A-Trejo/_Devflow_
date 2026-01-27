import type { ReactNode } from "react";
import { DEFAULT_EMPTY, DEFAULT_ERROR } from "../constants/states";
import { Inbox, type LucideIcon, CircleX } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => ReactNode;
}

interface StateSkeletonProps {
  icon: LucideIcon;
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSkeleton = ({
  icon: Icon,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
    <Icon className="size-18 text-primary" />
    <h2 className="font-bold text-xl mt-8">{title}</h2>
    <p className="my-3.5 max-w-md text-center">{message}</p>
    {button && (
      <Link
        href={button.href}
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-5 min-h-[46px] rounded-lg px-4 py-3 ",
        )}
      >
        {button.text}
      </Link>
    )}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = DEFAULT_EMPTY,
  render,
}: Props<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        icon={CircleX}
        title={error?.message || DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : DEFAULT_ERROR.message
        }
        button={DEFAULT_ERROR.button}
      />
    );
  }
  if (!data || data.length === 0)
    return (
      <StateSkeleton
        icon={Inbox}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  return <div>{render(data)}</div>;
};

export default DataRenderer;
