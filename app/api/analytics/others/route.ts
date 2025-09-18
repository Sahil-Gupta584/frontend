import { Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";
import { getTimestamp, normalizeReferrer } from "@/lib/utils/server";

type Metric = {
  label: string;
  visitors: number;
  revenue: number;
  imageUrl?: string;
};

export async function GET(req: NextRequest) {
  try {
    const websiteId = req.nextUrl.searchParams.get("websiteId");
    const duration = req.nextUrl.searchParams.get("duration");

    if (!websiteId || !duration) throw new Error("Invalid payload");

    let timestamp: string | number | null = getTimestamp(duration);

    if (timestamp === null) throw new Error("Invalid duration.");
    if (timestamp === 0) {
      const row = await database.listRows({
        databaseId,
        tableId: "events",
        queries: [
          Query.equal("website", websiteId),
          Query.limit(1),
          Query.orderAsc("$createdAt"),
        ],
      });

      timestamp = row.rows?.[0].$createdAt;
    }
    // const estart = Date.now();

    // 1. Fetch all events
    const eventsRes = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(100000000),
      ],
    });
    // console.log("Events time:", Date.now() - estart, "ms");

    const events = eventsRes.rows;

    // 2. Get unique sessionIds
    const sessionIds = Array.from(new Set(events.map((e) => e.sessionId)));
    // const rstart = Date.now();
    // 3. Fetch all revenues for these sessionIds
    const revenuesRes = await database.listRows({
      databaseId,
      tableId: "revenues",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(10000000),
      ],
    });
    // console.log("Revenues time:", Date.now() - rstart, "ms");

    const sessionSet = new Set(sessionIds);
    const revenues = revenuesRes.rows.filter((r) =>
      sessionSet.has(r.sessionId)
    );

    // Create a map for sessionId → total revenue
    const revenueMap = new Map<string, number>();

    revenues.forEach((r) => {
      const prev = revenueMap.get(r.sessionId) || 0;

      revenueMap.set(r.sessionId, prev + (r.revenue || 0));
    });

    // 4. Prepare buckets
    const pageMap = new Map<string, Metric>();
    const referrerMap = new Map<string, Metric>();
    const mapMap = new Map<
      string,
      {
        countryCode: string;
        visitors: number;
        revenue: number;
        imageUrl: string;
      }
    >();
    const countryMap = new Map<string, Metric>();
    const regionMap = new Map<string, Metric>();
    const cityMap = new Map<string, Metric>();
    const browserMap = new Map<string, Metric>();
    const osMap = new Map<string, Metric>();
    const deviceMap = new Map<string, Metric>();
    // const lstart = Date.now();
    // 5. Process events
    for (const e of events) {
      const sessionRevenue = revenueMap.get(e.sessionId) || 0;
      // Page
      const url = new URL(
        e.href?.startsWith("/") ? `http://localhost:300${e.href}` : e.href
      );
      const pathname = url.pathname;
      const page = pageMap.get(pathname);

      if (page) {
        page.visitors += 1;
        page.revenue += sessionRevenue;
      } else {
        pageMap.set(pathname, {
          label: pathname,
          visitors: 1,
          revenue: sessionRevenue,
        });
      }

      // Referrer
      const refDomain = normalizeReferrer(e.referrer);

      const ref = referrerMap.get(refDomain);

      if (ref) {
        ref.visitors += 1;
        ref.revenue += sessionRevenue;
      } else {
        referrerMap.set(refDomain, {
          label: refDomain,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://icons.duckduckgo.com/ip3/${refDomain}.ico`,
        });
      }

      // Map
      const m = mapMap.get(e.countryCode);

      if (m) {
        m.visitors += 1;
        m.revenue += sessionRevenue;
      } else {
        mapMap.set(e.countryCode, {
          countryCode: e.countryCode,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // Country
      const country = countryMap.get(e.countryCode);

      if (country) {
        country.visitors += 1;
        country.revenue += sessionRevenue;
      } else {
        countryMap.set(e.countryCode, {
          label: e.countryCode,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // Region
      const region = regionMap.get(e.region);

      if (region) {
        region.visitors += 1;
        region.revenue += sessionRevenue;
      } else {
        regionMap.set(e.region, {
          label: e.region,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // City
      const city = cityMap.get(e.city);

      if (city) {
        city.visitors += 1;
        city.revenue += sessionRevenue;
      } else {
        cityMap.set(e.city, {
          label: e.city,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        });
      }

      // Browser
      const browser = browserMap.get(e.browser);

      if (browser) {
        browser.visitors += 1;
        browser.revenue += sessionRevenue;
      } else {
        browserMap.set(e.browser, {
          label: e.browser,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${String(e.browser).toLowerCase()}/${String(e.browser).toLowerCase()}_64x64.png`,
        });
      }

      // OS
      const os = osMap.get(e.os);

      if (os) {
        os.visitors += 1;
        os.revenue += sessionRevenue;
      } else {
        osMap.set(e.os, {
          label: e.os,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `/images/${e.os}.png`,
        });
      }

      // Device
      const device = deviceMap.get(e.device);

      if (device) {
        device.visitors += 1;
        device.revenue += sessionRevenue;
      } else {
        deviceMap.set(e.device, {
          label: e.device,
          visitors: 1,
          revenue: sessionRevenue,
          imageUrl: `/images/${e.device}.png`,
        });
      }
    }
    // console.log("Loop time:", Date.now() - lstart, "ms");

    // 6. Convert Maps to arrays
    const dataset = {
      pageData: Array.from(pageMap.values()),
      referrerData: Array.from(referrerMap.values()),
      mapData: Array.from(mapMap.values()),
      countryData: Array.from(countryMap.values()),
      regionData: Array.from(regionMap.values()),
      cityData: Array.from(cityMap.values()),
      browserData: Array.from(browserMap.values()),
      osData: Array.from(osMap.values()),
      deviceData: Array.from(deviceMap.values()),
    };

    return NextResponse.json(dataset);
  } catch (err) {
    console.error("others", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
// 1st
// Events time: 6950 ms
// Revenues time: 212 ms
// Loop time: 9 ms

// 2nd
// Events time: 6605 ms
// Revenues time: 347 ms
// Loop time: 66 ms
