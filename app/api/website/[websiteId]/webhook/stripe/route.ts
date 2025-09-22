// app/api/website/[websiteId]/webhook/stripe/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const body = await req.json();

    // console.log("Stripe webhook body", JSON.stringify(body));

    const websiteId = (await params).websiteId;

    const eventType = body?.type;
    const data = body?.data?.object;
    let visitorId =
      //from subscription
      data.lines?.data?.[0]?.metadata?.insightly_visitor_id ||
      //from paymentintent
      data.metadata?.insightly_visitor_id;
    let sessionId =
      data.lines?.data?.[0]?.metadata?.insightly_session_id ||
      data.metadata?.insightly_session_id;
    if (
      eventType === "invoice.payment_succeeded"
      // data.lines?.data?.[0]?.parent?.subscription_item_details?.subscription ==
      // "sub_1SACVo1tNDBT2PI2y9sy67t4"
    ) {
      console.log("here:", JSON.stringify(data));
    }
    if (!visitorId || !sessionId) {
      console.log("No visitorId or sessionId in metadata", {
        websiteId,
        body: JSON.stringify(body),
      });
      return NextResponse.json({ ok: true }, { status: 400 });
    }
    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let sales = 0;

    switch (eventType) {
      case "payment_intent.succeeded":
        revenue = data.amount || 0;
        sales = revenue > 0 ? 1 : 0;
        break;

      case "invoice.payment_succeeded":
        // if (!visitorId || !sessionId) {
        //   const meta = await getMetafromSubscription(data.subscription);
        // }
        revenue = data?.amount_paid || 0;
        sales = revenue > 0 ? 1 : 0;
        break;
      case "refund.created":
        refundedRevenue = data?.amount_refunded
          ? data.amount_refunded / 100
          : 0;
        break;

      default:
        console.log("Unhandled Stripe event", eventType);
    }
    console.log({ revenue });

    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        eventType: "purchase",
        revenue: Number((revenue / 100).toFixed()),
        renewalRevenue,
        refundedRevenue,
        sessionId,
        visitorId,
        sales,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Stripe webhook error", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
