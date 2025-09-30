// app/api/website/[websiteId]/webhook/polar/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { isFirstRenewalDodo } from "@/app/api/actions";
import { database, databaseId } from "@/appwrite/serverConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const body = await req.json();

    const websiteId = (await params).websiteId;
    // console.log("body:", JSON.stringify(body));

    const eventType = body?.type;
    const data = body?.data;
    let visitorId = data?.metadata?.insightly_visitor_id;
    let sessionId = data?.metadata?.insightly_session_id;
    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let sales = 0;

    if (!visitorId || !sessionId) {
      console.log("No visitorId or sessionId in dodo hook", {
        websiteId,
        eventType,
        id: data?.id,
      });

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    switch (eventType) {
      case "subscription.renewed":
        console.log("data", JSON.stringify(data));
        if (!visitorId || !sessionId) {
          console.log(
            "No visitorId or sessionId found in metadata for dodo subscription.renewed",
            { websiteId }
          );

          return NextResponse.json(
            { ok: true, msg: "metadata not found" },
            { status: 400 }
          );
        }
        const firstRenewal = await isFirstRenewalDodo({
          subId: data?.subscription_id,
          websiteId,
        });

        firstRenewal
          ? (revenue = data?.recurring_pre_tax_amount)
          : (renewalRevenue = data?.recurring_pre_tax_amount);
        sales = 1;
        console.log("Subscription renewed for:", {
          websiteId,
          subId: data?.subscription_id,
        });
        break;
      case "payment.succeeded":
        if (data?.subscription_id) {
          console.log("Payment is for a subscription, ignoring", {
            websiteId,
            subsId: data?.subscription_id,
          });

          return NextResponse.json({ ok: true });
        }
        revenue =
          (data?.settlement_amount &&
            (data?.settlement_amount - data?.settlement_tax) / 100) ||
          0;
        sales = 1;
        console.log("Dodo Payment recorded for:", {
          websiteId,
          pay: data?.payment_id,
        });
        break;
      case "refund.succeeded":
        refundedRevenue =
          (data?.refunds && data.refunds[0] && data.refunds[0]?.amount) || 0;
        break;
      default:
        console.log("Unhandled event", eventType);
    }

    if (revenue === 0) {
      revenue = 1000;
    } else {
      console.log("body", JSON.stringify(body));
    }
    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        eventType: "purchase",
        revenue: revenue > 0 ? Number((revenue / 100).toFixed()) : 0,
        renewalRevenue:
          renewalRevenue > 0 ? Number((renewalRevenue / 100).toFixed()) : 0,
        refundedRevenue,
        sales,
        visitorId,
        sessionId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Dodo Webhook Err:", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
