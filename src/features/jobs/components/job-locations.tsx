import Image from "next/image";

interface JobLocationProps {
  job_country?: string;
  job_city?: string;
  job_state?: string;
}

const JobLocation = ({
  job_country,
  job_city,
  job_state,
}: JobLocationProps) => {
  const hasLocation = job_country || job_city || job_state;

  return (
    <div className="flex  items-center gap-2 py-3">
      {hasLocation ? (
        <>
          {job_country && (
            <Image
              src={`https://flagsapi.com/${job_country}/flat/64.png`}
              alt="country flag"
              width={16}
              height={16}
              className="rounded-full"
            />
          )}

          <p>{[job_city, job_state, job_country].filter(Boolean).join(", ")}</p>
        </>
      ) : (
        <p>--</p>
      )}
    </div>
  );
};

export default JobLocation;
