"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/components/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/shared/lib/utils";
import {
  formUrlQuery,
  removeKeysFromUrlQuery,
} from "@/features/search/lib/url";

interface FilterItem {
  name: string;
  value: string;
}

interface Props {
  filters: FilterItem[];
  queryKey?: string;
  defaultLabel?: string;
  showToggleOnly?: boolean;
}

const Filter = ({
  filters,
  queryKey = "filter",
  showToggleOnly = false,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeFilter = searchParams.get(queryKey) ?? "";

  const updateFilter = (value: string) => {
    const isActive = value === activeFilter;

    const newUrl = isActive
      ? removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: [queryKey],
        })
      : formUrlQuery({
          params: searchParams.toString(),
          key: queryKey,
          value,
        });

    router.replace(newUrl, { scroll: false });
  };

  return (
    <>
      {/* Desktop Buttons - only if NOT toggle only */}
      {!showToggleOnly && (
        <div className="hidden flex-wrap gap-3 sm:flex mt-4">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="secondary"
              className={cn(
                "rounded-lg px-6 py-3 capitalize shadow-none",
                activeFilter === filter.value &&
                  "bg-primary text-white hover:bg-primary/80",
              )}
              onClick={() => updateFilter(filter.value)}
            >
              {filter.name}
            </Button>
          ))}
        </div>
      )}

      {/* Select - always visible in toggle-only mode */}
      <div className={cn(showToggleOnly ? "block mt-4" : "sm:hidden mt-4")}>
        <Select value={activeFilter || undefined} onValueChange={updateFilter}>
          <SelectTrigger className="p-4 w-full">
            <SelectValue placeholder="Select a Filter" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {filters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default Filter;
