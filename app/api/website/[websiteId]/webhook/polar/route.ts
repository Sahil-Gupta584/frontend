// app/api/website/[websiteId]/webhook/polar/route.ts
import { database, databaseId } from "@/appwrite/serverConfig";
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const body = await req.json();
    console.log("body", body);

    const websiteId = (await params).websiteId;

    // Polar webhook type
    const eventType = body?.type;
    const data = body?.data;
    const visitorId = body?.data?.insightly_visitor_id;
    const sessionId = body?.data?.insightly_session_id;
    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let customers = 0;
    let sales = 0;

    switch (eventType) {
      case "order.created":
        revenue = data.amount ?? 0;
        sales = 1;
        customers = 1;
        break;

      case "order.refunded":
        refundedRevenue = data.amount ?? 0;
        break;

      case "subscription.created":
        revenue = data.amount ?? 0;
        sales = 1;
        customers = 1;
        break;

      case "subscription.updated":
        renewalRevenue = data.amount ?? 0;
        break;

      case "subscription.canceled":
        // maybe no direct revenue, just log churn
        break;

      default:
        console.log("Unhandled event", eventType);
    }

    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        eventType,
        revenue,
        renewalRevenue,
        refundedRevenue,
        customers,
        sales,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
