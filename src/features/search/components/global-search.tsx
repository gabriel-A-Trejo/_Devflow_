"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import debounce from "lodash/debounce";
import { formUrlQuery, removeKeysFromUrlQuery } from "../lib/url";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/components/ui";
import { SearchIcon } from "lucide-react";
import GlobalResult from "./global-result";

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("global") || "";

  const [search, setSearch] = useState(query);
  const [isOpen, setIsOpen] = useState(!!query);

  const searchContainerRef = useOutsideClick(() => {
    setIsOpen(false);
    setSearch("");
  });

  const DEBOUNCE_DELAY_MS = 300;

  const debouncedUpdate = useMemo(
    () =>
      debounce((value: string) => {
        if (value) {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "global",
            value,
          });
          router.push(newUrl, { scroll: false });
        } else if (query) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, { scroll: false });
        }
      }, DEBOUNCE_DELAY_MS),
    [router, searchParams, query],
  );

  useEffect(() => {
    debouncedUpdate(search);
    return () => debouncedUpdate.cancel();
  }, [search, debouncedUpdate]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <InputGroup className="relative flex min-h-[50px] items-center gap-1 rounded-xl ">
        <InputGroupInput
          placeholder="Search anything globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className=""
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && <GlobalResult />}
    </div>
  );
}
