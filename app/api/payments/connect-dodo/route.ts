import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";
import { dodoApiBaseUrl, getWebhookUrl } from "@/lib/utils/server";
import { dodoSchema } from "@/lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formdata = await dodoSchema.parseAsync(body);

    const addWebhookRes = await axios.post(
      dodoApiBaseUrl + `/webhooks`,
      {
        url: getWebhookUrl("Dodo", formdata.websiteId) || "",
        events: [
          "payment.succeeded",
          "refund.succeeded",
          "subscription.renewed",
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${formdata.apiKey}`,
        },
        validateStatus: () => true,
      }
    );

    if (addWebhookRes.data?.code) {
      throw new Error(
        "Failed to add webhook for dodopayments :(, Please check your API key or contact us."
      );
    }
    await database.upsertRow({
      databaseId,
      tableId: "keys",
      rowId: body.websiteId,
      data: {
        dodo: formdata.apiKey,
      },
    });

    const website = await database.getRow({
      databaseId,
      tableId: "websites",
      rowId: body.websiteId,
    });
    website.paymentProviders.push("Dodo");

    await database.updateRow({
      databaseId,
      tableId: "websites",
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
