import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";
import { getWebhookUrl, stripeApiBaseUrl } from "@/lib/utils/server";
import { stripeSchema } from "@/lib/zodSchemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formdata = await stripeSchema.parseAsync(body);

    const res = await axios.post(
      stripeApiBaseUrl + `/checkout/sessions`,
      {
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Test Product" },
              unit_amount: 100,
            },
            quantity: 1,
          },
        ],
        success_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
      },
      {
        headers: {
          Authorization: `Bearer ${formdata.apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        validateStatus: () => true,
      }
    );
    if (res.data?.error?.type === "invalid_request_error") {
      console.log(res.data);
      throw new Error(
        "rak_checkout_session_write scope not found for given key. Please use the link given in the form. "
      );
    }

    const params = new URLSearchParams();
    params.append("url", getWebhookUrl("Stripe", formdata.websiteId) || "");
    ["payment_intent.succeeded", "refund.created"].forEach((event) => {
      params.append("enabled_events[]", event);
    });

    const webhookRes = await axios.post(
      stripeApiBaseUrl + "/webhook_endpoints",
      params,
      {
        headers: { Authorization: `Bearer ${body.apiKey}` },
        validateStatus: () => true,
      }
    );

    if (webhookRes.data?.error?.type === "invalid_request_error") {
      throw new Error(
        "webhook:write scope not found for given key. Please use the link given in the form."
      );
    }
    if (webhookRes.status !== 200) {
      console.log(webhookRes.data);
      throw new Error("Failed to connect for stripe :(");
    }
    await database.upsertRow({
      databaseId,
      tableId: "keys",
      rowId: body.websiteId,
      data: {
        stripe: formdata.apiKey,
      },
    });

    const website = await database.getRow({
      databaseId,
      tableId: "websites",
      rowId: body.websiteId,
    });
    website.paymentProviders.push("Stripe");

    await database.updateRow({
      databaseId,
      tableId: "websites",
      rowId: body.websiteId,
      data: {
        paymentProviders: website.paymentProviders,
      },
    });

    console.log("Stripe connected for website:", body.websiteId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
