// app/api/website/[websiteId]/webhook/polar/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { getWebsiteKey } from "@/app/api/actions";
import { database, databaseId } from "@/appwrite/serverConfig";
import { polarBaseUrl } from "@/lib/utils/server";
import axios from "axios";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const body = await req.json();

    // console.log("body", body);

    const websiteId = (await params).websiteId;

    const eventType = body?.type;
    const data = body?.data;
    let visitorId = body?.data?.metadata?.insightly_visitor_id;
    let sessionId = body?.data?.metadata?.insightly_session_id;

    if ((!visitorId || !sessionId) && eventType === "order.paid") {
      const key = await getWebsiteKey(websiteId, "Polar");
      if (!key) return;

      if ((!visitorId || !sessionId) && data?.customer_id) {
        const customerRes = await axios.get(
          polarBaseUrl + `/customers/${data.customer_id}`,
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
            validateStatus: () => true,
          }
        );

        if (customerRes.data?.metadata) {
          visitorId =
            customerRes.data.metadata[`${websiteId}_insightlyVisitorId`];
          sessionId =
            customerRes.data.metadata[`${websiteId}_insightlySessionId`];
        }
      }

      if (!visitorId || !sessionId) {
        console.log(
          "No visitorId or sessionId found for Polar webhook in order.paid payload and customer metadata",
          {
            websiteId,
            eventType,
            id: data?.id,
            customer_id: data?.customer_id,
            checkout_id: data?.checkout_id,
          }
        );
        return NextResponse.json({ ok: true }, { status: 400 });
      }
    }

    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let sales = 0;

    switch (eventType) {
      case "order.paid":
        revenue = data.amount ?? 0;
        sales = 1;
        console.log("Polar Order paid:", { websiteId, orderId: data?.id });
        break;
      default:
        console.log("Unhandled polar event:", eventType);
        return NextResponse.json({ ok: true });
    }

    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        eventType: "purchase",
        revenue: Number((revenue / 100).toFixed(2)),
        renewalRevenue,
        refundedRevenue,
        visitorId,
        sessionId,
        sales,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Polar webhook error", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
