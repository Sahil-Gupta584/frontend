import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

import { database, databaseId } from "@/appwrite/serverConfig";
import { headers } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.visitorId || !body.sessionId || !body.websiteId)
      throw new Error("Invalid payload");
    const { visitorId, sessionId, websiteId } = body;
    const event = await database.listRows({
      databaseId,
      tableId: "events",
      queries: [
        Query.equal("visitorId", visitorId),
        Query.equal("sessionId", sessionId),
      ],
    });

    if (!event.rows[0]) throw new Error("Smart move 🫡, but you cant do it!");

    const isExist = await database.listRows({
      databaseId,
      tableId: "heartbeats",
      queries: [Query.equal("website", websiteId)],
    });

    if (!isExist.rows[0]) {
      await database.createRow({
        databaseId,
        tableId: "heartbeats",
        data: {
          sessionId,
          visitorId,
          website: websiteId,
        },
        rowId: ID.unique(),
      });
    }

    return NextResponse.json({ ok: true }, { headers: headers });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      ok: false,
      error: (error as Error).message || "Server Error",
    });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, {
    headers,
  });
}
