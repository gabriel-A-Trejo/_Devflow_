"use client";

import type { GlobalSearchItem } from "@/shared/types/global";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { globalSearch } from "../actions/global-search.action";
import ROUTES from "@/shared/constants/routes";
import GlobalFilter from "./global-filter";
import { Spinner } from "@/shared/components/ui";
import Link from "next/link";
import { Ban, Tag } from "lucide-react";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<GlobalSearchItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    if (!global) return;

    startTransition(async () => {
      setResult([]);

      try {
        const getData = await globalSearch({
          query: global as string,
          type,
        });
        setResult(getData.data as GlobalSearchItem[]);
      } catch (error) {
        console.log(error);
        setResult([]);
      }
    });
  }, [global, type]);

  const renderLinks = (type: string, id: string) => {
    switch (type) {
      case "question":
      case "answer":
        return ROUTES.QUESTION(id);
      case "user":
        return ROUTES.PROFILE(id);
      case "tag":
        return ROUTES.TAG(id);
      default:
        return "/";
    }
  };

  return (
    <section className="absolute top-full z-10 mt-3 w-full rounded-x; max-h-[600px] overflow-y-scroll no-scrollbar p-5 shadow-sm bg-background">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-muted-foreground" />
      <div className="space-y-5">
        <h4 className="font-bold text-lg">Top Match</h4>

        {isPending ? (
          <div className="flex-center flex-col px-5 gap-3">
            <Spinner className="size-10" />
            <p>Browsing the whole database</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result?.length > 0 ? (
              result?.map((item: GlobalSearchItem, index) => (
                <Link
                  href={renderLinks(item.type, item.id)}
                  key={`${item.type}-${item.id}-${index}`}
                  className="flex w-full cursor-pointer items-start gap-3 p-2 hover:bg-muted-foreground/10"
                >
                  <Tag />
                  <div className="flex flex-col">
                    <p className="line-clamp-1">{item.title}</p>
                    <p className="mt-1 font-bold capitalize">{item.type}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5 gap-2">
                <Ban className="size-10 text-destructive" />
                <p className=" px-5 py-2.5">Oops, no results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default GlobalResult;
