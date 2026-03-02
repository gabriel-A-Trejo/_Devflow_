import { Skeleton } from "@/shared/components/ui";
import React from "react";

const loading = () => {
  return (
    <>
      <Skeleton className="h-10 w-36" />
      <Skeleton className="h-14 w-full mt-10" />
      <div className="mt-4 flex flex-wrap gap-3 max-md:hidden">
        <Skeleton className="px-[49.5px] py-[18px] rounded-lg " />
        <Skeleton className="px-[49.5px] py-[18px] rounded-lg " />
        <Skeleton className="px-[49.5px] py-[18px] rounded-lg " />
        <Skeleton className="px-[49.5px] py-[18px] rounded-lg " />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton key={item} className="h-44 w-full rounded-[10px]" />
        ))}
      </div>
    </>
  );
};

export default loading;
