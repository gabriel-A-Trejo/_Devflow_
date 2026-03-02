import { Heading } from "@/shared/components/header/heading";
import { Skeleton } from "@/shared/components/ui";
import React from "react";

const loading = () => {
  return (
    <>
      <Heading>Ask a Question</Heading>

      <div className="mt-10 flex w-full flex-col gap-10">
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 rounded-sm" />
          <Skeleton className="min-h-[56px] w-full rounded-[10px]" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 rounded-sm" />
          <Skeleton className="h-[300px] w-full rounded-[10px]" />
          <Skeleton className="w-64 h-4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-24 h-4 rounded-sm" />
          <Skeleton className="min-h-[56px] w-full rounded-[10px]" />
          <Skeleton className="w-64 h-4" />
        </div>
      </div>

      <div className="flex justify-end items-center">
        <Skeleton className="h-14 w-28" />
      </div>
    </>
  );
};

export default loading;
