import { Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { verifyAnalyticsPayload } from "../../actions";

import { database, databaseId } from "@/appwrite/serverConfig";

export async function GET(req: NextRequest) {
  try {
    const { timestamp, websiteId } = await verifyAnalyticsPayload(req);

    // Fetch goals
    const goalsRes = await database.listRows({
      databaseId,
      tableId: "goals",
      queries: [
        Query.equal("website", websiteId),
        Query.greaterThan("$createdAt", new Date(timestamp).toISOString()),
        Query.limit(100000000),
      ],
    });
    const goals = goalsRes.rows;
    const goalsBucket: Record<string, any> = {};

    for (const g of goals) {
      if (goalsBucket[g.name]) {
        goalsBucket[g.name].visitors += 1;
      } else {
        goalsBucket[g.name] = {
          visitors: 1,
          label: g.name,
        };
      }
    }

    return NextResponse.json(Object.values(goalsBucket));
  } catch (err) {
    console.error("others", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
