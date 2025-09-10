"use server";

import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";
import { ID, Query } from "node-appwrite";

export async function isDomainExists(domain: string) {
  try {
    return await database.listRows({
      databaseId,
      tableId: websitesTableId,
      queries: [Query.equal("domain", domain)],
    });
  } catch (error) {
    return null;
  }
}

export async function createDomain(data: any) {
  try {
    return await database.createRow({
      databaseId: databaseId,
      tableId: websitesTableId,
      rowId: ID.unique(),
      data,
    });
  } catch (error) {
    throw error;
  }
}
