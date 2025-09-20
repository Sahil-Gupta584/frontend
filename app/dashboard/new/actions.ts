"use server";

import { ID, Query } from "node-appwrite";

import { database, databaseId } from "@/appwrite/serverConfig";
import { TPaymentProviders } from "@/lib/types";

export async function isDomainExists(domain: string) {
  try {
    return await database.listRows({
      databaseId,
      tableId: "websites",
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
      tableId: "websites",
      rowId: ID.unique(),
      data,
    });
  } catch (error) {
    throw error;
  }
}

export async function disconnectProvider(
  websiteId: string,
  provider: TPaymentProviders
) {
  try {
    const website = await database.getRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
      queries: [Query.select(["paymentProviders"])],
    });

    const updatedProviders = (website.paymentProviders || []).filter(
      (p: string) => p !== provider
    );

    // update row
    await database.updateRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
      data: {
        paymentProviders: updatedProviders,
      },
    });
  } catch (error) {
    throw error;
  }
}
