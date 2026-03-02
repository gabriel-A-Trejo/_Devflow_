"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "../lib/url";
import { GlobalSearchFilters } from "@/shared/constants/filters";
import { Button } from "@/shared/components/ui";

export default function GlobalFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeType = searchParams.get("type") ?? "";

  const handleTypeClick = (value: string) => {
    const isActive = value === activeType;

    const newUrl = isActive
      ? removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["type"],
        })
      : formUrlQuery({
          params: searchParams.toString(),
          key: "type",
          value,
        });

    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-5 ">
      <p className="font-bold">Type:</p>

      <div className="flex gap-3 ">
        {GlobalSearchFilters.map((item) => {
          const isActive = activeType === item.value;

          return (
            <Button
              key={item.value}
              type="button"
              variant="secondary"
              className={`rounded-lg px-6 py-3 capitalize shadow-none cursor-pointer ${
                isActive ? "bg-primary text-white hover:bg-primary/80" : ""
              }`}
              onClick={() => handleTypeClick(item.value)}
            >
              {item.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
