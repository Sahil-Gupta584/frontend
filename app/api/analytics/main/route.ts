import { database, databaseId } from "@/appwrite/serverConfig";
import { getTimestamp } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(
  req: NextRequest
  //   props
) {
  try {
    const websiteId = req.nextUrl.searchParams.get("websiteId");
    const duration = req.nextUrl.searchParams.get("duration");

    if (!websiteId || !duration) throw new Error("Invalid payload");

    const timestamp = getTimestamp(duration);
    if (!timestamp) throw new Error("Invalid duration.");

    // 1. Fetch events
    const eventsRes = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()), // ✅
      ],
    });

    // 2. Fetch revenues
    const revenuesRes = await database.listRows({
      databaseId,
      tableId: "revenues",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()), // ✅
      ],
    });

    const events = eventsRes.rows;
    const revenues = revenuesRes.rows;

    // 3. Normalize into daily buckets
    const buckets: Record<string, any> = {};

    // --- Visitors ---
    for (const ev of events) {
      const date = new Date(ev.$createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!buckets[date]) {
        buckets[date] = {
          name: new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
          visitors: 0,
          revenue: 0,
          renewalRevenue: 0,
          refundedRevenue: 0,
          customers: 0,
          sales: 0,
          goalCount: 0,
          timestamp: new Date(date).toISOString(),
        };
      }
      buckets[date].visitors += 1;
    }

    // --- Revenues ---
    for (const rev of revenues) {
      const date = new Date(rev.timestamp).toISOString().split("T")[0];
      if (!buckets[date]) {
        buckets[date] = {
          name: new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
          visitors: 0,
          revenue: 0,
          renewalRevenue: 0,
          refundedRevenue: 0,
          customers: 0,
          sales: 0,
          goalCount: 0,
          timestamp: new Date(date).toISOString(),
        };
      }
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

    return NextResponse.json(dataset);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
