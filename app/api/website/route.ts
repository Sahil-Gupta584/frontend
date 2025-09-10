import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";

import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";
import { account } from "@/appwrite/clientConfig";

export async function POST(req: NextRequest) {
  try {
    const { domain, timezone } = await req.json();
    const user = await account.get();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const result = await database.createRow({
      databaseId: "68b2b44d003465280f37",
      tableId: "68b2b466000179a3332c",
      rowId: ID.unique(),
      data: { domain, timezone, userId: user.$id },
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const isEvents = req.nextUrl.searchParams.get("events");

    if (!userId) throw new Error("Invalid userId");

    const websiteRes = await database.listRows({
      databaseId: databaseId,
      tableId: websitesTableId,
      queries: [Query.equal("userId", userId)],
    });
    let websites = websiteRes.rows;

    if (isEvents) {
      websites = await Promise.all(
        websiteRes.rows.map(async (w) => {
          const eventsRes = await database.listRows({
            databaseId: databaseId,
            tableId: "events",
            queries: [Query.equal("website", w.$id)],
          });

          return { ...w, events: eventsRes.rows };
        }),
      );
    }

    return NextResponse.json({ ok: true, websites });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
