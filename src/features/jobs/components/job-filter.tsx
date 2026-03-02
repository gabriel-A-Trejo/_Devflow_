"use client";

import Search from "@/features/search";
import { formUrlQuery } from "@/features/search/lib/url";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/shared/components/ui";
import type { Country } from "@/shared/types/global";
import { MapPin } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  countriesList: Country[];
  defaultCountry?: string;
}
const JobFilter = ({ countriesList, defaultCountry }: Props) => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      value,
      key: "location",
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <Search
        route={pathName}
        placeholder="Search for company, jobs title, or keyword"
        otherClasses="w-full  "
      />
      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={defaultCountry || undefined}
      >
        <SelectTrigger className="p-[23] rounded-md w-full sm:max-w-48  flex ">
          <div className="flex gap-2 items-center">
            <MapPin />
            <SelectValue placeholder="Select a country" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {countriesList && countriesList.length > 0 ? (
              countriesList.map((country: Country) => (
                <SelectItem
                  key={country.name}
                  value={country.iso2}
                  className="p-2"
                >
                  {country.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="No results found">No results found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default JobFilter;
