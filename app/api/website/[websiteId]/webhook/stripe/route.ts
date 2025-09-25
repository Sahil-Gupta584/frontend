// app/api/website/[websiteId]/webhook/stripe/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { getSessionMetaFromStripe } from "@/app/api/actions";
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
    let visitorId = data?.metadata?.insightly_visitor_id;
    let sessionId = data.metadata?.insightly_session_id;
    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let sales = 0;

    switch (eventType) {
      case "payment_intent.succeeded":
        const metadata = await getSessionMetaFromStripe(data?.id, websiteId);

        if (!metadata)
          return NextResponse.json({
            ok: true,
            msg: "No metadata found in stripe checkout session",
          });

        visitorId = metadata.visitorId;
        sessionId = metadata.sessionId;
        revenue = data?.amount || 0;
        sales = revenue > 0 ? 1 : 0;
        console.log("Stripe Payment completed for for mode:", metadata?.mode, {
          websiteId,
          paymentInt: body?.id,
        });
        break;
      case "refund.created":
        refundedRevenue = data?.amount_refunded
          ? data.amount_refunded / 100
          : 0;
        break;

      default:
        console.log("Unhandled Stripe event", eventType);
    }
    if (!visitorId || !sessionId) {
      console.log("No visitorId or sessionId in stripe hook", {
        websiteId,
        eventType,
      });
    }

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
