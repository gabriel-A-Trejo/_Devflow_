"use client";

import { Button } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "../../search/lib/url";

const filters = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommended", value: "recommended" },
];

const HomeFilter = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const initialFilter = searchParams.get("filter") ?? "";
  const [active, setActive] = useState(initialFilter);

  const handleTypeClick = (filter: string) => {
    const isActive = filter === active;

    const newUrl = isActive
      ? removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["filter"],
        })
      : formUrlQuery({
          params: searchParams.toString(),
          key: "filter",
          value: filter,
        });

    router.replace(newUrl, { scroll: false });
    setActive(isActive ? "" : filter);
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant="secondary"
          className={cn(
            "rounded-lg px-6 py-3 capitalize shadow-none",
            active === filter.value &&
              "bg-primary text-white hover:bg-primary/80",
          )}
          onClick={() => handleTypeClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
