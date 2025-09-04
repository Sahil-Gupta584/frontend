export function getFaviconUrl(domain: string) {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

// utility to round down to nearest bucket (ex: 3h groups → 0-2 = 0, 3-5 = 3, etc.)
export function bucketHour(date: Date, groupSize: number) {
  const h = date.getHours();
  const bucket = Math.floor(h / groupSize) * groupSize;
  const d = new Date(date);
  d.setHours(bucket, 0, 0, 0);
  return d;
}

export function getCountryName(countryCode: string) {
  return (
    new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) ||
    "Unknown"
  );
}

export function getTimestamp(duration: string) {
  const now = new Date();

  switch (duration) {
    case "today":
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();

    case "yesterday": {
      const d = new Date(now);
      d.setDate(now.getDate() - 1);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }

    case "last_24_hours":
      return now.getTime() - 24 * 60 * 60 * 1000;

    case "last_7_days":
      return now.getTime() - 7 * 24 * 60 * 60 * 1000;

    case "last_30_days":
      return now.getTime() - 30 * 24 * 60 * 60 * 1000;

    case "last_12_months": {
      const d = new Date(now);
      d.setFullYear(now.getFullYear() - 1);
      return d.getTime();
    }

    case "all_time":
      return 0; // start of epoch

    default:
      return null; // fallback for safety
  }
}
