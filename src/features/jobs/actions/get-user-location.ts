import type { UserLocation } from "@/shared/types/global";

export async function getUserLocation() {
  try {
    const res = await fetch(
      `http://ip-api.com/json?fields=country,countryCode,city`,
    );
    const location = await res.json();

    return {
      country: location.country,
      countryCode: location.countryCode,
      city: location.city.toString().replace(" ", ""),
    } as UserLocation;
  } catch (error) {
    console.log(error);
  }
}
