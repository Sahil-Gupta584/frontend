"use server";
import { Query } from "node-appwrite";

import { TWebsiteData } from "./settings/components/generalTab";

import { database, databaseId } from "@/appwrite/serverConfig";
import { TEvent, TLiveVisitor } from "@/lib/types";

export async function getLiveVisitors(websiteId: string) {
  try {
    const expiredRows = await database.listRows({
      databaseId,
      tableId: "heartbeats",
      queries: [
        Query.lessThan(
          "$createdAt",
          new Date(Date.now() - 5 * 60 * 1000).toISOString()
        ),
      ],
    });

    await Promise.all(
      expiredRows.rows.map(async (r) => {
        await database.deleteRow({
          databaseId,
          rowId: r.$id,
          tableId: "heartbeats",
        });
      })
    );

    return (
      await database.listRows({
        databaseId,
        tableId: "heartbeats",
        queries: [
          Query.equal("website", websiteId),
          Query.select(["visitorId", "sessionId"]),
        ],
      })
    ).rows;
  } catch (error) {
    console.log(error);
  }
}

export async function getWebsite(websiteId: string) {
  try {
    const res = await database.getRow({
      databaseId,
      tableId: "websites",
      rowId: websiteId,
    });

    return res;
  } catch (error) {
    console.log(error);
    null;
  }
}

export async function saveWebsiteData({
  $id,
  domain,
  timezone,
}: TWebsiteData & { $id: string }) {
  try {
    await database.updateRow({
      databaseId,
      tableId: "websites",
      rowId: $id,
      data: {
        domain,
        timezone,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteWebsite($id: string) {
  try {
    await database.deleteRow({
      databaseId,
      tableId: "websites",
      rowId: $id,
    });
  } catch (error) {
    throw error;
  }
}

export async function getLiveVisitorsEvent(liveVisitors: TLiveVisitor[]) {
  try {
    const events: TEvent[] = [];

    for (const lv of liveVisitors) {
      const eventsRes = await database.listRows({
        databaseId,
        tableId: "events",
        queries: [
          Query.equal("visitorId", lv.visitorId),
          Query.equal("sessionId", lv.sessionId),
          Query.orderDesc("$createdAt"),
          Query.limit(1),
        ],
      });
      const totalVisit = await database.listRows({
        databaseId,
        tableId: "events",
        queries: [
          Query.equal("visitorId", lv.visitorId),
          Query.equal("sessionId", lv.sessionId),
        ],
      });
      if (eventsRes.rows[0])
        // @ts-expect-error
        events.push({
          ...eventsRes.rows[0],
          totalVisit: totalVisit.total,
          lastEventTs: lv.$createdAt,
        });
    }

    return events;
  } catch (error) {
    throw error;
  }
}
