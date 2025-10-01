import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { verifyAnalyticsPayload } from "../../actions";

import { database, databaseId } from "@/appwrite/serverConfig";
import { getDateKey } from "@/lib/utils/server";

export async function GET(req: NextRequest) {
  try {
    const { timestamp, websiteId, duration } =
      await verifyAnalyticsPayload(req);

    const checkForEmpty = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [Query.equal("website", websiteId), Query.limit(1)],
    });

    if (checkForEmpty && !checkForEmpty.rows[0])
      return NextResponse.json({
        dataset: [],
        avgSessionTime: 0,
        bounceRate: 0,
        isEmpty: true,
      });

    // 1. Fetch events
    const eventsRes = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(100000000),
      ],
    });

    // // 2. Fetch revenues
    const revenuesRes = await database.listRows({
      databaseId,
      tableId: "revenues",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(100000000),
      ],
    });

    const events = eventsRes.rows;

    const revenues = revenuesRes.rows;

    const buckets: Record<string, any> = {};

    const startDate = new Date(timestamp);

    const endDate = new Date();

    for (
      let d = new Date(startDate);
      d <= endDate;
      duration === "today" ||
      duration === "yesterday" ||
      duration === "last_24_hours"
        ? d.setHours(d.getHours() + 1)
        : duration === "last_12_months" || duration === "all_time"
          ? d.setMonth(d.getMonth() + 1)
          : d.setDate(d.getDate() + 1)
    ) {
      const dateKey = getDateKey(d.toISOString(), duration);

      if (!buckets[dateKey]) {
        buckets[dateKey] = {
          id: `${d.toISOString()}`, // ✅ unique identifier
          name:
            duration === "today" ||
            duration === "yesterday" ||
            duration === "last_24_hours"
              ? d
                  .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })
                  .replace(" AM", "am")
                  .replace(" PM", "pm")
              : duration === "last_12_months" || duration === "all_time"
                ? d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                  }),
          visitors: 0,
          revenue: 0,
          renewalRevenue: 0,
          refundedRevenue: 0,
          customers: 0,
          sales: 0,
          goalCount: 0,
          timestamp: d.toISOString(),
        };
      }
    }
    // --- Visitors ---
    for (const ev of events) {
      const date = getDateKey(ev.$createdAt, duration);

      if (!buckets[date]) {
        console.log("🚨 Missing bucket for event:", {
          eventCreatedAt: ev.$createdAt,
          parsedDateKey: date,
          loopStart: startDate.toISOString(),
          loopEnd: endDate.toISOString(),
          allBucketKeys: Object.keys(buckets),
        });
      }
      buckets[date].visitors += 1;
    }

    // --- Revenues ---
    for (const rev of revenues) {
      const date = getDateKey(rev.$createdAt, duration);

      buckets[date].revenue += rev.revenue || 0;
      buckets[date].renewalRevenue += rev.renewalRevenue || 0;
      buckets[date].refundedRevenue += rev.refundedRevenue || 0;
      buckets[date].customers += rev.customers || 0;
      buckets[date].sales += rev.sales || 0;
    }

    // 4. Convert buckets → array sorted by date
    const dataset = Object.values(buckets).sort(
      (a: any, b: any) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const sessionDurations: number[] = [];

    const groupedBySession: Record<string, string[]> = {};

    for (const ev of events) {
      if (!groupedBySession[ev.sessionId]) groupedBySession[ev.sessionId] = [];
      groupedBySession[ev.sessionId].push(ev.$createdAt);
    }

    for (const sessionId in groupedBySession) {
      const timestamps = groupedBySession[sessionId].map((t) =>
        new Date(t).getTime()
      );
      const min = Math.min(...timestamps);
      const max = Math.max(...timestamps);
      const duration = (max - min) / 1000; // in seconds

      if (duration > 0) sessionDurations.push(duration);
    }

    const avgSessionTime =
      sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length;

    const totalSessions = Object.keys(groupedBySession).length;

    let bounceCount = 0;

    for (const sessionId in groupedBySession) {
      if (groupedBySession[sessionId].length === 1) {
        bounceCount++;
      }
    }

    const bounceRate =
      totalSessions > 0 ? ((bounceCount / totalSessions) * 100).toFixed(2) : 0;

    return NextResponse.json({ dataset, avgSessionTime, bounceRate });
  } catch (err) {
    console.error("main", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
