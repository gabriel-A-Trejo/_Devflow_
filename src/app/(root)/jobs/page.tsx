import { getCountries } from "@/features/jobs/actions/get-countries";
import { getUserLocation } from "@/features/jobs/actions/get-user-location";
import JobFilter from "@/features/jobs/components/job-filter";
import JobList from "@/features/jobs/components/job-list";
import { Heading } from "@/shared/components/header/heading";
import type { RouteParams } from "@/shared/types/global";
import { Suspense } from "react";

const Jobs = async ({ searchParams }: RouteParams) => {
  const { query, location, page } = await searchParams;

  const userLocation = await getUserLocation();
  const countries = await getCountries();

  return (
    <>
      <Heading>Jobs</Heading>
      <section className="relative flex flex-col sm:flex-row gap-2 mt-8">
        <JobFilter
          countriesList={countries}
          defaultCountry={userLocation?.countryCode}
        />
      </section>

      <section className="mt-12">
        <Suspense fallback={<div>Loading</div>}>
          <JobList query={query} location={location} page={page} />
        </Suspense>
      </section>
    </>
  );
};

export default Jobs;
