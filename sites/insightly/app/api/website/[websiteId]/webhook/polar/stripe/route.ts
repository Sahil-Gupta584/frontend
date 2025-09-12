// app/api/website/[websiteId]/webhook/stripe/route.ts
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId } from "@/appwrite/serverConfig";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ websiteId: string }> },
) {
  try {
    const body = await req.json();

    console.log("Stripe webhook body", body);

    const websiteId = (await params).websiteId;

    const eventType = body?.type;
    const data = body?.data?.object;

    let revenue = 0;
    let renewalRevenue = 0;
    let refundedRevenue = 0;
    let customers = 0;
    let sales = 0;

    switch (eventType) {
      case "checkout.session.completed":
        // Subscription or one-time checkout
        revenue = data?.amount_total ? data.amount_total / 100 : 0;
        sales = 1;
        customers = 1;
        break;

      case "invoice.payment_succeeded":
        // Can be initial or renewal
        revenue = data?.amount_paid ? data.amount_paid / 100 : 0;
        sales = 1;
        break;

      case "invoice.payment_failed":
        // no revenue, maybe flag failed payments
        break;

      case "customer.subscription.created":
        revenue = data?.plan?.amount ? data.plan.amount / 100 : 0;
        sales = 1;
        customers = 1;
        break;

      case "customer.subscription.updated":
        renewalRevenue = data?.plan?.amount ? data.plan.amount / 100 : 0;
        break;

      case "customer.subscription.deleted":
        // churn event, no direct revenue
        break;

      case "charge.refunded":
        refundedRevenue = data?.amount_refunded
          ? data.amount_refunded / 100
          : 0;
        break;

      case "charge.succeeded":
        revenue = data?.amount ? data.amount / 100 : 0;
        sales = 1;
        customers = 1;
        break;

      default:
        console.log("Unhandled Stripe event", eventType);
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
    console.error("Stripe webhook error", err);

    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
