import { Skeleton } from "@/shared/components/ui";
import React from "react";

const loading = () => {
  return (
    <div className="space-y-10">
      {/* ===== Author + Votes + Save ===== */}
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        {/* Author */}
        <div className="flex items-center gap-2">
          {/* Matches UserAvatar h-9 w-9 */}
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Votes + Save */}
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

          {/* Save button */}
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      {/* ===== Title ===== */}
      <Skeleton className="h-8 w-3/4" />

      {/* ===== Metrics ===== */}
      <div className="flex flex-wrap gap-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* ===== Question Content Preview ===== */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* ===== Tags ===== */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>

      {/* ================================================== */}
      {/* ================= AllAnswers ===================== */}
      {/* ================================================== */}
      <div className="mt-11 space-y-8">
        {/* Header + Filter */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>

        {/* Answer Cards */}
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4 rounded-lg border p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center gap-3">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>

      {/* ================================================== */}
      {/* ================= AnswerForm ===================== */}
      {/* ================================================== */}
      <div className="border-t pt-8 space-y-6">
        {/* Title + AI Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-44 rounded-lg" />
        </div>

        {/* Editor */}
        <Skeleton className="h-40 w-full rounded-lg" />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
export default loading;
