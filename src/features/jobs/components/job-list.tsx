import { getJobs } from "../actions/get-jobs";
import type { Job, UserLocation } from "@/shared/types/global";
import { Inbox } from "lucide-react";
import JobCard from "./jobs-card";
import Pagination from "@/shared/components/pagination/Pagination";

interface Props {
  query: string;
  location: string;
  page: string;
  userLocation?: UserLocation;
}
const JobList = async ({ query, location, page, userLocation }: Props) => {
  const jobs = await getJobs({
    query: location
      ? "jobs"
      : query
        ? query
        : `Software Engineer in ${userLocation?.city}`,
    page: page ?? 1,
    location: location ?? userLocation?.countryCode,
  });
  const parsedPage = parseInt(page ?? 1);
  return (
    <>
      {jobs?.length > 0 ? (
        <div className="flex flex-col gap-6 items-center">
          {jobs
            ?.filter((job: Job) => job.job_title)
            .map((job: Job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
        </div>
      ) : (
        <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
          <Inbox className="size-18 text-primary" />
          <h2 className="font-bold text-xl mt-8">No jobs Found</h2>
          <p className="my-3.5 max-w-md text-center">
            Try adjusting your search or check back later.
          </p>
        </div>
      )}
      {jobs?.length > 0 && (
        <Pagination page={parsedPage} isNext={jobs?.length === 10} />
      )}
    </>
  );
};

export default JobList;
