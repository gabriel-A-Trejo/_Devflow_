import type { getFilterJobParams } from "@/shared/types/action";

export async function getJobs(filters: getFilterJobParams) {
  const { query, page, location } = filters;

  const headers = {
    "X-RapidAPI-Key": process.env.X_RapidAPI_Key ?? "",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  };

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${query}&page=${page}&country=${location}`,
    {
      method: "GET",
      headers,
    },
  );

  const jobs = await response.json();
  return jobs.data;
}
