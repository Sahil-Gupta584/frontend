import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";
import { getWebhookUrl, polarBaseUrl } from "@/lib/utils/server";
import { polarSchema } from "@/lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formdata = await polarSchema.parseAsync(body);

    const checkoutsRes = await axios.get(polarBaseUrl + "/checkouts", {
      headers: {
        Authorization: `Bearer ${formdata.accessToken}`,
      },
      validateStatus: () => true,
    });

    if (checkoutsRes.data?.error === "insufficient_scope") {
      throw new Error(`checkouts:read scope not found for given token.`);
    }
    if (checkoutsRes.data?.error) {
      console.log(checkoutsRes.data);
      throw new Error(checkoutsRes.data.error);
    }

    const customerRes = await axios.post(
      polarBaseUrl + `/customers`,
      { email: Math.random().toString() + "@gmail.com" },
      {
        headers: {
          Authorization: `Bearer ${formdata.accessToken}`,
        },
        validateStatus: () => true,
      }
    );
    if (customerRes.data?.error === "insufficient_scope") {
      throw new Error("customer:write scope not found for given token.");
    }
    if (customerRes.data?.error) {
      console.log(customerRes.data);
      throw new Error(customerRes.data.error);
    }

    const addWebhookRes = await axios.post(
      polarBaseUrl + "/webhooks/endpoints",
      {
        format: "raw",
        url: getWebhookUrl("Polar", formdata.websiteId),
        events: ["order.paid"],
      },
      {
        headers: {
          Authorization: `Bearer ${formdata.accessToken}`,
        },
        validateStatus: () => true,
      }
    );
    if (addWebhookRes.data?.error === "insufficient_scope") {
      throw new Error("webhook:write scope not found for given token.");
    }
    if (addWebhookRes.data?.error) {
      console.log(addWebhookRes.data);
      throw new Error(addWebhookRes.data.error);
    }

    await database.upsertRow({
      databaseId,
      tableId: "keys",
      rowId: formdata.websiteId,
      data: {
        polar: formdata.accessToken,
      },
    });

    const website = await database.getRow({
      databaseId,
      tableId: "websites",
      rowId: formdata.websiteId,
    });
    website.paymentProviders.push("Polar");
    await database.updateRow({
      databaseId,
      tableId: "websites",
      rowId: formdata.websiteId,
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
