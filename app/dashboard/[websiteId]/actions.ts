"use server";
import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";
import { Query } from "node-appwrite";
import { TWebsiteData } from "./settings/components/generalTab";

export async function getLiveVisitors(websiteId: string) {
  try {
    const expiredRows = await database.listRows({
      databaseId,
      tableId: "heartbeat",
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
          tableId: "heartbeat",
        });
      })
    );
    return (
      await database.listRows({
        databaseId,
        tableId: "heartbeat",
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
      tableId: websitesTableId,
      rowId: websiteId,
    });
    return { domain: res.domain, timezone: res.timezone };
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
      tableId: websitesTableId,
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
      tableId: websitesTableId,
      rowId: $id,
    });
  } catch (error) {
    throw error;
  }
}
