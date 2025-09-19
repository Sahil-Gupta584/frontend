// app/api/website/[websiteId]/webhook/polar/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> }
) {
  try {
    const body = await req.json();

    const websiteId = (await params).websiteId;

    const eventType = body?.type;
    const data = body?.data;
    const visitorId = data?.metadata?.insightly_visitor_id;
    const sessionId = data?.metadata?.insightly_session_id;
    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let customers = 0;
    let sales = 0;

    switch (eventType) {
      case "payment.succeeded":
        revenue =
          (data?.settlement_amount &&
            (data?.settlement_amount - data?.settlement_tax) / 100) ||
          0;
        sales = 1;
        customers = 1;
        break;

      case "refund.succeeded":
        refundedRevenue =
          (data?.refunds && data.refunds[0] && data.refunds[0]?.amount) || 0;
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
        visitorId,
        sessionId,
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
