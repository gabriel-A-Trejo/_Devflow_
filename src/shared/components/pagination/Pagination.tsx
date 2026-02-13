"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/";
import { formUrlQuery } from "@/features/search/lib/url";

interface Props {
  page: number | undefined | string;
  isNext: boolean;
  containerClasses?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.replace(newUrl);
  };

  if (!isNext && Number(page) === 1) return null;

  return (
    <UIPagination>
      <PaginationContent className={cn("mt-8  sm:gap-4", containerClasses)}>
        {Number(page) > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className="w-full"
              onClick={() => handleNavigation("prev")}
              size={undefined}
            />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink className="w-full p-4" size={undefined} isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {isNext && (
          <PaginationItem>
            <PaginationNext
              className="w-full"
              onClick={() => handleNavigation("next")}
              size={undefined}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </UIPagination>
  );
};

export default Pagination;
