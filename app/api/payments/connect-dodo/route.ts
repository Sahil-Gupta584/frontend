import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import {
  database,
  databaseId,
  MODE,
  websitesTableId,
} from "@/appwrite/serverConfig";
import { dodoSchema } from "@/lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formdata = await dodoSchema.parseAsync(body);

    const addWebhookRes = await axios.post(
      `https://${MODE === "prod" ? "live" : "test"}.dodopayments.com/webhooks`,
      {
        url: `https://2d48021762e3.ngrok-free.app/api/website/${formdata.websiteId}/webhook/dodo`,
        events: ["payment.succeeded", "refund.succeeded"],
      },
      {
        headers: {
          Authorization: `Bearer ${formdata.apiKey}`,
        },
        validateStatus: () => true,
      }
    );

    if (addWebhookRes.data?.code) {
      throw new Error("Failed to add webhook for dodopayments :(");
    }

    const website = await database.getRow({
      databaseId,
      tableId: websitesTableId,
      rowId: body.websiteId,
    });

    website.paymentProviders.push("Dodo");

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
