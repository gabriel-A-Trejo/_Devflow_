import Image from "next/image";
import Link from "next/link";

import CompactCard from "@/shared/components/compact/compact-card";

import { Clock, DollarSign, Globe, MoveRight } from "lucide-react";

import { Metric } from "@/features/question/components/metric";
import JobLocation from "./job-locations";
import type { Job } from "@/shared/types/global";
import { processJobTitle } from "../lib/process-job-title";
import { formatNumber } from "@/features/question/lib/formatNumber";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface Props {
  job: Job;
}

const JobCard = ({
  job: {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
    job_max_salary,
    job_min_salary,
  },
}: Props) => {
  const formattedTitle = processJobTitle(job_title);

  const salary =
    job_max_salary && job_min_salary
      ? `${formatNumber(+job_min_salary)} - ${formatNumber(+job_max_salary)}`
      : "--";

  return (
    <CompactCard
      cardClassName="w-full"
      title={formattedTitle}
      headerClassName="hidden"
      content={
        <section className="flex flex-col gap-6 p-2">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative size-24">
                <Image
                  src={employer_logo || "/icons/logo.svg"}
                  alt={`${formattedTitle} logo`}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>

              <div>
                <h2 className="font-bold">{formattedTitle}</h2>

                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {job_description?.slice(0, 150) ?? "--"}
                </p>
              </div>
            </div>

            <JobLocation
              job_country={job_country}
              job_city={job_city}
              job_state={job_state}
            />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-6 items-center flex-wrap">
              <Metric
                icon={Clock}
                value={job_employment_type ?? "--"}
                title=""
                textStyles=""
              />

              <Metric icon={DollarSign} value={salary} title="" textStyles="" />

              {employer_website && (
                <Link
                  href={employer_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Globe size={16} />
                  Company Website
                </Link>
              )}
            </div>

            <Link
              href={job_apply_link ?? "/jobs"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex items-center gap-2",
              )}
            >
              Apply Now
              <MoveRight size={18} />
            </Link>
          </div>
        </section>
      }
    />
  );
};

export default JobCard;
