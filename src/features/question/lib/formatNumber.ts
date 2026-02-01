export function formatNumber(value?: number | null) {
  const number = typeof value === "number" ? value : 0;

  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(1) + "M";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}
