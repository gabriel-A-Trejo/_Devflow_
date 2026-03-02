export async function getCountries() {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/flag/images",
    );
    const countries = await response.json();

    return countries.data;
  } catch (error) {
    console.log(error);
  }
}
