import { Skeleton } from "@/shared/components/ui";

const votePlaceholder = () => {
  return (
    <div className="flex items-center gap-6">
      {/* Votes skeleton */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );
};

export default votePlaceholder;
