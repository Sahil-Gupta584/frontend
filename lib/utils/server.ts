import { database, databaseId } from "@/appwrite/serverConfig";
import { Query } from "node-appwrite";

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

export function getLabel(timestamp: string, duration: string) {
  const date = new Date(timestamp);

  switch (duration) {
    case "last_7_days":
    case "last_30_days": {
      // Example: "Sunday, 31 Aug"
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      });
    }

    case "today":
    case "yesterday":
    case "last_24_hours": {
      // Example: "Today 08:30 PM" or "Yesterday 09:15 AM"
      const isToday = date.toDateString() === new Date().toDateString();
      const dayLabel = isToday ? "Today" : "Yesterday";

      return `${dayLabel} ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    case "last_12_months": {
      // Example: "August"
      return date.toLocaleDateString("en-US", {
        month: "long",
      });
    }

    case "all_time": {
      // Example: "Aug 2024"
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    }

    default:
      return date.toLocaleDateString("en-US");
  }
}

export function getDateKey(timestamp: string, duration: string): string {
  const date = new Date(timestamp);

  switch (duration) {
    case "today":
    case "yesterday":
    case "last_24_hours":
      // Group by HOUR
      return date.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

    case "last_12_months":
    case "all_time":
      // Group by MONTH
      return date.toISOString().slice(0, 7); // "YYYY-MM"

    default:
      // Default → Group by DAY
      return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }
}

export function getInterval(duration: string) {
  switch (duration) {
    case "today":
    case "yesterday":
    case "last_24_hours":
      // Group by HOUR
      return 4;

    case "last_7_days":
    case "last_12_months":
    case "all_time":
      // Group by MONTH
      return 4;

    default:
      // Default → Group by DAY
      return 4;
  }
}

export function normalizeReferrer(referrer?: string): string {
  if (!referrer || !referrer.trim()) {
    return "Direct/None";
  }

  try {
    // Add protocol if missing
    const url = referrer.startsWith("http")
      ? new URL(referrer)
      : new URL(`http://${referrer}`);

    let host = url.hostname;

    // Normalize localhost
    if (host.startsWith("localhost")) {
      return "localhost";
    }

    // Strip www.
    if (host.startsWith("www.")) {
      host = host.slice(4);
    }

    return host || "Direct/None";
  } catch {
    return "Direct/None";
  }
}

export async function getGeo(ip: string) {
  try {
    const token = process.env.IP_INFO_TOKEN;

    if (!token) console.error("Invalid ipinfo token");
    const url = `https://ipinfo.io/${ip}?token=${token}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) return null;

    return data;
  } catch (error) {
    console.log("Error to get Geo", error);

    return null;
  }
}

export async function fetchRevenuesInChunks(
  sessionIds: string[],
  websiteId: string,
  timestamp: string
) {
  const chunkSize = 50;
  let results: any[] = [];

  for (let i = 0; i < sessionIds.length; i += chunkSize) {
    const chunk = sessionIds.slice(i, i + chunkSize);

    const res = await database.listRows({
      databaseId,
      tableId: "revenues",
      queries: [
        Query.equal("website", websiteId),
        Query.equal("sessionId", chunk),
        Query.greaterThan("$createdAt", timestamp),
        Query.limit(1000),
      ],
    });

    results = results.concat(res.rows);
  }

  return results;
}

export function normalizeBrowser(name?: string): string {
  if (!name) return "unknown";
  const lower = name.toLowerCase();

  if (lower.includes("chrome")) return "chrome";
  if (lower.includes("safari")) return "safari";
  if (lower.includes("firefox")) return "firefox";
  if (lower.includes("edge")) return "edge";
  if (lower.includes("opera") || lower.includes("opr")) return "opera";
  if (lower.includes("brave")) return "brave";

  return lower.replace(/\s+/g, ""); // fallback: remove spaces
}

export function normalizeOS(name?: string): string {
  if (!name) return "unknown";
  const lower = name.toLowerCase();

  if (lower.includes("windows")) return "windows";
  if (lower.includes("mac")) return "macos";
  if (lower.includes("ios")) return "ios";
  if (lower.includes("android")) return "android";
  if (lower.includes("linux")) return "linux";

  return lower.replace(/\s+/g, "");
}
