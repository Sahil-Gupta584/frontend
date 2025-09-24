import { database, databaseId } from "@/appwrite/serverConfig";
import { TPaymentProviders } from "@/lib/types";
import { dodoApiBaseUrl, stripeApiBaseUrl } from "@/lib/utils/server";
import axios from "axios";
import { ID, Query } from "node-appwrite";

export async function updateStripeCheckSession({
  csid,
  sId,
  vId,
  websiteId,
}: {
  csid: string;
  websiteId: string;
  vId: string;
  sId: string;
}) {
  try {
    const key = await getWebsiteKey(websiteId, "Stripe");
    if (!key) return;
    const params = new URLSearchParams();
    params.append("metadata[insightly_visitor_id]", vId);
    params.append("metadata[insightly_session_id]", sId);
    const res = await axios.post(
      stripeApiBaseUrl + `/checkout/sessions/${csid}`,
      params,
      {
        headers: { Authorization: `Bearer ${key.rows[0].stripe}` },
        validateStatus: () => true,
      }
    );
    // console.log("updateStripeCheckSession:", JSON.stringify(res?.data));

    if (!res?.data?.id) {
      console.log("Failed to update checkout stripe checkout session", {
        websiteId,
        csid,
        res: res.data,
      });
      return;
    }
    console.log("updated stripe checkout session", {
      csid,
      websiteId,
    });
  } catch (error) {
    console.log("Error updating stripe session metadata", error, {
      csid,
      websiteId,
    });
    return;
  }
}
export async function getSessionMetaFromStripe(
  payIntId: string,
  websiteId: string
) {
  try {
    const key = await getWebsiteKey(websiteId, "Stripe");
    if (!key) return;
    const res = await axios.get(
      stripeApiBaseUrl + `/checkout/sessions?payment_intent=${payIntId}`,
      {
        headers: { Authorization: `Bearer ${key.rows[0].stripe}` },
        validateStatus: () => true,
      }
    );
    const sessionData = res?.data?.data?.[0];
    if (!sessionData) {
      console.log("Unable to find session using paymentIntent", {
        payIntId,
        websiteId,
        sessionData: res.data,
      });
      return;
    }

    if (
      !sessionData?.metadata?.insightly_session_id ||
      !sessionData?.metadata?.insightly_visitor_id
    ) {
      console.log("No metadata found in checkout session", {
        payIntId,
        websiteId,
      });
      return;
    }
    return {
      visitorId: sessionData?.metadata.insightly_visitor_id,
      sessionId: sessionData?.metadata.insightly_session_id,
      mode: sessionData?.mode,
    };
  } catch (error) {
    console.log("Error fetching stripe payment metadata", error, {
      payIntId,
      websiteId,
    });
    return;
  }
}

export async function isFirstRenewalDodo({
  subId,
  websiteId,
}: {
  subId: string;
  websiteId: string;
}) {
  try {
    const key = await getWebsiteKey(websiteId, "Stripe");
    if (!key) return;
    const paymentsRes = await axios.get(
      dodoApiBaseUrl + `/payments?subscription_id=${subId}`,
      { headers: { Authorization: `Bearer ${key.rows[0].dodo}` } }
    );
    console.log("paymentsRes:", JSON.stringify(paymentsRes.data));
    return paymentsRes.data?.items?.length === 1;
  } catch (error) {
    console.log("Error checking first renewal for dodo", error, {
      subId,
      websiteId,
    });
    return false;
  }
}

export async function handleDodoSubscriptionLink({
  sId,
  subId,
  vId,
  websiteId,
}: {
  subId: string;
  websiteId: string;
  vId: string;
  sId: string;
}) {
  try {
    const key = await getWebsiteKey(websiteId, "Stripe");
    if (!key) return;

    const subRes = await axios.get(dodoApiBaseUrl + `/subscriptions/${subId}`, {
      headers: { Authorization: `Bearer ${key.rows[0].dodo}` },
    });
    const subscription = subRes.data;
    const isMetadataExists =
      subscription.metadata?.insightly_session_id &&
      subscription.metadata?.insightly_visitor_id;
    if (isMetadataExists) {
      console.log("Metadata already exists for dodo subscription", {
        subId,
        websiteId,
      });
      return;
    }
    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        sessionId: sId,
        visitorId: vId,
        revenue: Number(
          (subscription.recurring_pre_tax_amount / 100).toFixed()
        ),
        renewalRevenue: 0,
        refundedRevenue: 0,
        sales: 1,
        eventType: "purchase",
      },
    });
    const res = await axios.patch(
      dodoApiBaseUrl + `/subscriptions/${subId}`,
      {
        metadata: {
          insightly_visitor_id: vId,
          insightly_session_id: sId,
        },
      },
      { headers: { Authorization: `Bearer ${key.rows[0].dodo}` } }
    );
    if (!res?.data?.subscription_id) {
      console.log(
        "Failed to add metadata for dodo subscription",
        sId,
        "website:",
        websiteId
      );
    }
    console.log("handled dodo subscription link", {
      sId,
      subId,
      vId,
      websiteId,
    });
  } catch (error) {
    console.log("handleDodoSubscriptionLink Error", error, {
      sId,
      subId,
      websiteId,
    });
  }
}

export async function handleDodoPaymentLink({
  sId,
  payId,
  vId,
  websiteId,
}: {
  payId: string;
  websiteId: string;
  vId: string;
  sId: string;
}) {
  try {
    console.log("handleDodoPaymentLink", { sId, payId, vId, websiteId });

    const key = await getWebsiteKey(websiteId, "Stripe");
    if (!key) return;
    console.log("key", key.rows[0]);

    const payRes = await axios.get(dodoApiBaseUrl + `/payments/${payId}`, {
      headers: { Authorization: `Bearer ${key.rows[0].dodo}` },
    });
    const payment = payRes.data;
    const isMetadataExists =
      payment?.metadata?.insightly_session_id &&
      payment?.metadata?.insightly_visitor_id;
    if (isMetadataExists) {
      console.log("Metadata already exists for dodo subscription", {
        payId,
        websiteId,
      });
      return;
    }
    if (payment.status !== "succeeded") {
      console.log("Payment not succeeded, skipping revenue creation", {
        payId,
        websiteId,
        status: payment.status,
      });
      return;
    }
    await database.createRow({
      databaseId,
      tableId: "revenues",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        sessionId: sId,
        visitorId: vId,
        revenue: Number((payment.settlement_amount / 100).toFixed()),
        renewalRevenue: 0,
        refundedRevenue: 0,
        sales: 1,
        eventType: "purchase",
      },
    });
    console.log("handled dodo payment link", { sId, payId, vId, websiteId });
  } catch (error) {
    console.log("handleDodoSubscriptionLink Error", error, {
      sId,
      payId,
      websiteId,
    });
  }
}

async function getWebsiteKey(websiteId: string, provider: TPaymentProviders) {
  const res = await database.listRows({
    databaseId,
    tableId: "keys",
    queries: [Query.equal("$id", websiteId)],
  });
  if (!res.rows[0]?.[provider.toLowerCase()]) {
    console.log("No stripe key found for website", { websiteId });
    return;
  }
  return res;
}
