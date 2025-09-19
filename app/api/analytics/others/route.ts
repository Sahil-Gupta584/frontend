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

    const sessionIds = Array.from(new Set(events.map((e) => e.sessionId)));
    // const rstart = Date.now();

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

    const revenueMap = new Map<string, number>();
    const seenPaymentIds = new Set<string>();

    for (const r of revenuesRes.rows) {
      const pid = r.payment_id ?? r.paymentId ?? r.$id;
      if (pid && seenPaymentIds.has(pid)) continue;
      if (pid) seenPaymentIds.add(pid);

      const sid = r.sessionId ?? r.sessionId; // match your schema
      const revNum = Number(r.revenue ?? r.total_amount ?? 0); // ensure numeric
      revenueMap.set(sid, (revenueMap.get(sid) || 0) + revNum);
    }

    // 2) Group events by sessionId
    const sessions = new Map<string, typeof events>();
    for (const e of events) {
      const sid = e.sessionId;
      if (!sid) continue;
      if (!sessions.has(sid)) sessions.set(sid, []);
      sessions.get(sid)!.push(e);
    }

    // 3) Prepare bucket maps (same as yours)
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

    // small helper to safely parse URL and fix your localhost port bug
    const getPathname = (href?: string) => {
      try {
        if (!href) return "/";
        const safeHref = href.startsWith("/")
          ? `http://localhost:3000${href}`
          : href;
        return new URL(safeHref).pathname;
      } catch {
        return href ?? "/";
      }
    };

    // const lstart = Date.now();
    for (const [sid, evts] of sessions.entries()) {
      const sessionRevenue = revenueMap.get(sid) || 0;

      const uniquePages = new Set(evts.map((e) => getPathname(e.href)));
      const uniqueReferrers = new Set(
        evts.map((e) => normalizeReferrer(e.referrer))
      );
      const uniqueCountries = new Set(
        evts.map((e) => e.countryCode || "UNKNOWN")
      );
      const uniqueRegions = new Set(evts.map((e) => e.region || "UNKNOWN"));
      const uniqueCities = new Set(evts.map((e) => e.city || "UNKNOWN"));
      const uniqueBrowsers = new Set(evts.map((e) => e.browser || "UNKNOWN"));
      const uniqueOS = new Set(evts.map((e) => e.os || "UNKNOWN"));
      const uniqueDevices = new Set(evts.map((e) => e.device || "UNKNOWN"));

      // Pages
      for (const pathname of uniquePages) {
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
      }

      // Referrers
      for (const refDomain of uniqueReferrers) {
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
      }

      // Countries / map
      for (const countryCode of uniqueCountries) {
        const m = mapMap.get(countryCode);
        if (m) {
          m.visitors += 1;
          m.revenue += sessionRevenue;
        } else {
          mapMap.set(countryCode, {
            countryCode,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`,
          });
        }

        const country = countryMap.get(countryCode);
        if (country) {
          country.visitors += 1;
          country.revenue += sessionRevenue;
        } else {
          countryMap.set(countryCode, {
            label: countryCode,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode}.svg`,
          });
        }
      }

      // Regions
      for (const region of uniqueRegions) {
        const rg = regionMap.get(region);
        if (rg) {
          rg.visitors += 1;
          rg.revenue += sessionRevenue;
        } else {
          regionMap.set(region, {
            label: region,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `/images/${region}.png`,
          });
        }
      }

      // Cities
      for (const city of uniqueCities) {
        const ct = cityMap.get(city);
        if (ct) {
          ct.visitors += 1;
          ct.revenue += sessionRevenue;
        } else {
          cityMap.set(city, {
            label: city,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `/images/${city}.png`,
          });
        }
      }

      // Browser / OS / Device
      for (const b of uniqueBrowsers) {
        const browser = browserMap.get(b);
        if (browser) {
          browser.visitors += 1;
          browser.revenue += sessionRevenue;
        } else {
          browserMap.set(b, {
            label: b,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/${String(b).toLowerCase()}/${String(b).toLowerCase()}_64x64.png`,
          });
        }
      }

      for (const o of uniqueOS) {
        const os = osMap.get(o);
        if (os) {
          os.visitors += 1;
          os.revenue += sessionRevenue;
        } else {
          osMap.set(o, {
            label: o,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `/images/${o}.png`,
          });
        }
      }

      for (const d of uniqueDevices) {
        const device = deviceMap.get(d);
        if (device) {
          device.visitors += 1;
          device.revenue += sessionRevenue;
        } else {
          deviceMap.set(d, {
            label: d,
            visitors: 1,
            revenue: sessionRevenue,
            imageUrl: `/images/${d}.png`,
          });
        }
      }
    }

    // console.log("Loop time:", Date.now() - lstart, "ms");
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
