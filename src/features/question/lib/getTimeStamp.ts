export const getTimeStamp = (createdAt: Date): string => {
  const diffSeconds = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / 1000,
  );

  if (diffSeconds <= 5) return "just now";

  const UNITS = [
    { label: "year", seconds: 60 * 60 * 24 * 365 },
    { label: "day", seconds: 60 * 60 * 24 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ] as const;

  for (const unit of UNITS) {
    const value = Math.floor(diffSeconds / unit.seconds);

    if (value >= 1) {
      return `${value} ${unit.label}${value === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
};
