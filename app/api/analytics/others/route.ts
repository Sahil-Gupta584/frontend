import { Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { verifyAnalyticsPayload } from "../../actions";

import { database, databaseId } from "@/appwrite/serverConfig";
import { normalizeReferrer } from "@/lib/utils/server";

type Metric = {
  label: string;
  visitors: number;
  revenue: number;
  imageUrl?: string;
  convertingVisitors?: number;
  countryCode?: string;
  conversionRate?: number;
};

export async function GET(req: NextRequest) {
  try {
    const { timestamp, websiteId } = await verifyAnalyticsPayload(req);

    // Fetch events
    const eventsRes = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(100000000),
      ],
    });
    const events = eventsRes.rows;

    // Fetch revenues
    const sessionIds = Array.from(new Set(events.map((e) => e.sessionId)));
    const revenuesRes = await database.listRows({
      databaseId,
      tableId: "revenues",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(10000000),
      ],
    });
    const sessionSet = new Set(sessionIds);
    const revenues = revenuesRes.rows.filter((r) =>
      sessionSet.has(r.sessionId)
    );

    // Map session → revenue
    const revenueMap = new Map<string, number>();

    revenues.forEach((r) => {
      const prev = revenueMap.get(r.sessionId) || 0;

      revenueMap.set(r.sessionId, prev + (r.revenue || 0));
    });

    // Buckets
    const pageMap = new Map<string, Metric>();
    const referrerMap = new Map<string, Metric>();
    const countryMap = new Map<string, Metric>();
    const regionMap = new Map<string, Metric>();
    const cityMap = new Map<string, Metric>();
    const browserMap = new Map<string, Metric>();
    const osMap = new Map<string, Metric>();
    const deviceMap = new Map<string, Metric>();

    const seenSessions = new Set<string>();

    // Global totals for overall conversion rate
    let totalVisitors = 0;
    let totalConvertingVisitors = 0;

    // Process events
    for (const e of events) {
      const sessionTotalRevenue = revenueMap.get(e.sessionId) || 0;
      const giveRevenue = !seenSessions.has(e.sessionId);

      if (giveRevenue) seenSessions.add(e.sessionId);

      // Count global visitors
      totalVisitors += 1;
      if (giveRevenue && sessionTotalRevenue > 0) totalConvertingVisitors += 1;

      // Helper function to update bucket
      const updateBucket = (
        map: Map<string, Metric>,
        key: string,
        extra?: Partial<Metric>
      ) => {
        const bucket = map.get(key);

        if (bucket) {
          bucket.visitors += 1;
          if (giveRevenue && sessionTotalRevenue > 0) {
            bucket.convertingVisitors = (bucket.convertingVisitors || 0) + 1;
            bucket.revenue += sessionTotalRevenue;
          }
        } else {
          map.set(key, {
            label: key,
            visitors: 1,
            revenue:
              giveRevenue && sessionTotalRevenue > 0 ? sessionTotalRevenue : 0,
            convertingVisitors: giveRevenue && sessionTotalRevenue > 0 ? 1 : 0,
            ...extra,
          });
        }
      };

      // --- Page ---
      const pathname = new URL(
        e.href?.startsWith("/") ? `http://localhost:300${e.href}` : e.href
      ).pathname;

      updateBucket(pageMap, pathname);

      // --- Referrer ---
      const refDomain = normalizeReferrer(e.referrer);

      updateBucket(referrerMap, refDomain, {
        imageUrl: `https://icons.duckduckgo.com/ip3/${refDomain}.ico`,
      });

      // --- Country ---
      updateBucket(countryMap, e.countryCode, {
        imageUrl: `https://purecatamphetamine.github.io/country-flag-icons/3x2/${e.countryCode}.svg`,
        countryCode: e.countryCode,
      });

      // --- Region ---
      updateBucket(regionMap, e.region);
      // --- City ---
      updateBucket(cityMap, e.city);
      // --- Browser ---
      updateBucket(browserMap, e.browser);
      // --- OS ---
      updateBucket(osMap, e.os);
      // --- Device ---
      updateBucket(deviceMap, e.device);
    }

    // Finalize: compute per-bucket conversion rates
    const finalizeMetrics = (map: Map<string, Metric>) =>
      Array.from(map.values()).map((m) => ({
        ...m,
        conversionRate:
          m.visitors > 0 ? ((m.convertingVisitors || 0) / m.visitors) * 100 : 0,
      }));

    const dataset = {
      pageData: finalizeMetrics(pageMap),
      referrerData: finalizeMetrics(referrerMap),
      countryData: finalizeMetrics(countryMap),
      regionData: finalizeMetrics(regionMap),
      cityData: finalizeMetrics(cityMap),
      browserData: finalizeMetrics(browserMap),
      osData: finalizeMetrics(osMap),
      deviceData: finalizeMetrics(deviceMap),
      overallConversionRate:
        totalVisitors > 0 ? (totalConvertingVisitors / totalVisitors) * 100 : 0,
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
