export function processJobTitle(title: string | undefined | null): string {
  //* Check if title is undefined or null
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  //* Split the title into words
  const words = title.split(" ");

  //* Filter out undefined or null and other unwanted words
  const validWords = words.filter((word) => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  //* If no valid words are left, return the general title
  if (validWords.length === 0) {
    return "No Job Title";
  }

  //* Join the valid words to create the processed title
  const processedTitle = validWords.join(" ");

  return processedTitle;
}
