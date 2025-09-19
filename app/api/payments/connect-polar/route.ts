import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import {
  database,
  databaseId,
  MODE,
  websitesTableId,
} from "@/appwrite/serverConfig";

const basePolarApi = `https://${MODE == "prod" ? "" : "sandbox-"}api.polar.sh/v1`;

async function fetchWithScopeCheck(
  endpoint: string,
  token: string,
  scopeName: string
) {
  const res = await axios.get(`${basePolarApi}${endpoint}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true, // don't throw automatically
  });

  // Centralized error handling
  if (res.data?.error === "insufficient_scope") {
    throw new Error(`${scopeName} scope not found for given token.`);
  }

  return res.data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Reuse helper function
    // const organization = await fetchWithScopeCheck(
    //   `/organizations/${body.orgId}`,
    //   body.token,
    //   "Organization",
    // );

    // const orders = await fetchWithScopeCheck("/orders", body.token, "Orders");

    // const subscriptions = await fetchWithScopeCheck(
    //   "/subscriptions",
    //   body.token,
    //   "Subscriptions",
    // );

    const addWebhookRes = await axios.post(
      basePolarApi + "/webhooks/endpoints",
      {
        format: "raw",
        // url: `https://insightly.appwrite.network/api/website/${body.websiteId}/webhook/polar`,
        url: `https://d4c3b54a2cbb.ngrok-free.app/api/website/${body.websiteId}/webhook/polar`,
        events: [
          "order.created",
          "order.refunded",
          "subscription.created",
          "subscription.updated",
          "subscription.canceled",
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${body.token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: () => true,
      }
    );

    if (addWebhookRes.data?.error === "insufficient_scope") {
      throw new Error("webhook:write scope not found for given token.");
    }

    const website = await database.getRow({
      databaseId,
      tableId: websitesTableId,
      rowId: body.websiteId,
    });

    website.paymentProviders.push("Polar");

    await database.updateRow({
      databaseId,
      tableId: websitesTableId,
      rowId: body.websiteId,
      data: {
        paymentProviders: website.paymentProviders,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
