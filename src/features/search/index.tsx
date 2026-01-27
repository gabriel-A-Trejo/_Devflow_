"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "./lib/url";
import { type LucideIcon, Search as DefaultSearchIcon } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchProps {
  Icon?: LucideIcon;
  iconPosition?: "inline-start" | "inline-end";
  placeholder?: string;
  otherClasses?: string;
  route: string;
}

const Search = ({
  Icon = DefaultSearchIcon,
  placeholder = "Search...",
  otherClasses = "",
  iconPosition = "inline-start",
  route,
}: SearchProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const searchParamsString = searchParams.toString();
  const DEBOUNCE_DELAY_MS = 300;

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        const newUrl = value
          ? formUrlQuery({
              params: searchParamsString,
              key: "query",
              value,
            })
          : pathname === route
            ? removeKeysFromUrlQuery({
                params: searchParamsString,
                keysToRemove: ["query"],
              })
            : null;

        if (newUrl) router.replace(newUrl, { scroll: false });
      }, DEBOUNCE_DELAY_MS),
    [router, pathname, route, searchParamsString],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    debouncedUpdate(searchQuery);
    return () => debouncedUpdate.cancel();
  }, [searchQuery]);

  return (
    <InputGroup className={`input-base ${otherClasses}`}>
      <InputGroupInput
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <InputGroupAddon align={iconPosition}>
        <Icon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Search;
