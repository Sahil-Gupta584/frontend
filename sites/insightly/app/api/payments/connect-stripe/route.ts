import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { database, databaseId, websitesTableId } from "@/appwrite/serverConfig";

const baseStripeApi = "https://api.stripe.com/v1";

async function fetchWithScopeCheckStripe(
  endpoint: string,
  token: string,
  scopeName: string,
) {
  const res = await axios.get(`${baseStripeApi}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: () => true,
  });

  if (res.status === 401) {
    throw new Error("Invalid Stripe token provided.");
  }

  if (res.data?.error?.code === "permission_error") {
    throw new Error(`${scopeName} scope not found for given token.`);
  }

  return res.data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // const res = await axios(baseStripeApi + "/invoices", {
    //   headers: {
    //     Authorization: `Bearer rk_test_51Rxrun0Cb53S3vQuzvEOpqZW6STlDROcUisTfEFyIC3vUqCa4jLmG1K3TpCdT96rj7cpvy9gRmOx9rQ6hjkcn4PA00FXal3OLy`,
    //   },
    //   validateStatus: () => true,
    // });

    // console.log("data", res.data);

    // // 1. Verify the key can fetch the account (org)
    // const account = await fetchWithScopeCheckStripe(
    //   "/account",
    //   body.token,
    //   "Account"
    // );

    // // 2. Fetch resources to confirm scopes (optional but recommended)
    // const customers = await fetchWithScopeCheckStripe(
    //   "/customers?limit=1",
    //   body.token,
    //   "Customer Read"
    // );

    // const subscriptions = await fetchWithScopeCheckStripe(
    //   "/subscriptions?limit=1",
    //   body.token,
    //   "Subscription Read"
    // );

    // // 3. Register webhook endpoint

    const params = new URLSearchParams();

    params.append(
      "url",
      `https://d4c3b54a2cbb.ngrok-free.app/api/website/${body.websiteId}/webhook/stripe`,
    );

    [
      "charge.succeeded",
      "charge.refunded",
      "checkout.session.completed",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
    ].forEach((event) => {
      params.append("enabled_events[]", event);
    });

    const webhookRes = await axios.post(
      `${baseStripeApi}/webhook_endpoints`,
      params,
      {
        headers: { Authorization: `Bearer ${body.apiKey}` },
        validateStatus: () => true,
      },
    );

    // console.log(webhookRes.data);

    if (webhookRes.data?.error?.type === "invalid_request_error") {
      throw new Error("webhook:write scope not found for given key.");
    }

    const website = await database.getRow({
      databaseId,
      tableId: websitesTableId,
      rowId: body.websiteId,
    });

    website.paymentProviders.push("Stripe");

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
      { status: 400 },
    );
  }
}
