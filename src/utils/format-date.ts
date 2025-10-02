export function formatDateTimeId(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return d
    .toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace("pukul ", "");
}
