import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

import { database, databaseId } from "@/appwrite/serverConfig";
import { headers } from "@/lib/constants";
import { getGeo, normalizeBrowser, normalizeOS } from "@/lib/utils/server";
import {
  handleDodoPaymentLink,
  handleDodoSubscriptionLink,
  updateStripeCheckSession,
} from "../actions";

export async function POST(req: NextRequest) {
  try {
    const {
      websiteId,
      href,
      referrer,
      viewport,
      visitorId,
      sessionId,
      type,
      extraData,
    } = await req.json();

    if (extraData) {
      if (extraData.stripe_session_id) {
        await updateStripeCheckSession({
          csid: extraData.stripe_session_id,
          sId: sessionId,
          vId: visitorId,
          websiteId,
        });
      }
      if (extraData.dodo_subscription_id) {
        await handleDodoSubscriptionLink({
          sId: sessionId,
          subId: extraData.dodo_subscription_id,
          vId: visitorId,
          websiteId,
        });
      }
      if (extraData.dodo_payment_id) {
        await handleDodoPaymentLink({
          sId: sessionId,
          payId: extraData.dodo_payment_id,
          vId: visitorId,
          websiteId,
        });
      }
    }
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);

    const browser = normalizeBrowser(parser.getBrowser().name);
    const os = normalizeOS(parser.getOS().name);

    let device = parser.getDevice().type || "desktop";
    if (!device) {
      const width = viewport?.width || 0;
      if (width <= 768) device = "mobile";
      else if (width <= 1024) device = "tablet";
      else device = "desktop";
    }

    let ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
    ip = ip === "::1" ? "103.190.15.171" : ip;

    const geo = await getGeo(ip);

    // console.log({ device, os, browser });

    const website = await database.getRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
    });

    if (!website)
      throw new Error(
        "Website not found, please register it on https://insightly.appwrite.network/dashboard/new"
      );

    // Save event without viewport
    await database.createRow({
      databaseId: databaseId,
      tableId: "events",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        href,
        referrer: referrer ? new URL(referrer).hostname : null,
        visitorId,
        sessionId,
        type,
        browser,
        os,
        device,
        countryCode: geo?.country || "XX",
        city: geo?.city || "Unknown",
        region: geo?.region || "Unknown",
      },
    });

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { headers: headers });
}

let a = {
  id: "evt_1SAT9K1tNDBT2PI2uYDlkA6a",
  object: "event",
  api_version: "2025-08-27.basil",
  created: 1758622121,
  data: {
    object: {
      id: "in_1SAT9H1tNDBT2PI2208PWaBx",
      object: "invoice",
      account_country: "US",
      account_name: "New business sandbox",
      account_tax_ids: null,
      amount_due: 100,
      amount_overpaid: 0,
      amount_paid: 100,
      amount_remaining: 0,
      amount_shipping: 0,
      application: null,
      attempt_count: 0,
      attempted: true,
      auto_advance: false,
      automatic_tax: {
        disabled_reason: null,
        enabled: false,
        liability: null,
        provider: null,
        status: null,
      },
      automatically_finalizes_at: null,
      billing_reason: "subscription_create",
      collection_method: "charge_automatically",
      created: 1758622119,
      currency: "usd",
      custom_fields: null,
      customer: "cus_T6gWVBJaWBIXDk",
      customer_address: {
        city: null,
        country: "IN",
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      },
      customer_email: "guptas3067@gmail.com",
      customer_name: "Sahil Gupt",
      customer_phone: null,
      customer_shipping: null,
      customer_tax_exempt: "none",
      customer_tax_ids: [],
      default_payment_method: null,
      default_source: null,
      default_tax_rates: [],
      description: null,
      discounts: [],
      due_date: null,
      effective_at: 1758622119,
      ending_balance: 0,
      footer: null,
      from_invoice: null,
      hosted_invoice_url:
        "https://invoice.stripe.com/i/acct_1RxtB51tNDBT2PI2/test_YWNjdF8xUnh0QjUxdE5EQlQyUEkyLF9UNmdXbzZUTFdpdHZ2blpRejB6ZHZ1bEhxSjlSaFBwLDE0OTE2MjkyMg0200v14nCLmG?s=ap",
      invoice_pdf:
        "https://pay.stripe.com/invoice/acct_1RxtB51tNDBT2PI2/test_YWNjdF8xUnh0QjUxdE5EQlQyUEkyLF9UNmdXbzZUTFdpdHZ2blpRejB6ZHZ1bEhxSjlSaFBwLDE0OTE2MjkyMg0200v14nCLmG/pdf?s=ap",
      issuer: { type: "self" },
      last_finalization_error: null,
      latest_revision: null,
      lines: {
        object: "list",
        data: [
          {
            id: "il_1SAT9H1tNDBT2PI2hxSLWlPZ",
            object: "line_item",
            amount: 100,
            currency: "usd",
            description: "1 × Insightly pro (at $1.00 / month)",
            discount_amounts: [],
            discountable: true,
            discounts: [],
            invoice: "in_1SAT9H1tNDBT2PI2208PWaBx",
            livemode: false,
            metadata: {},
            parent: {
              invoice_item_details: null,
              subscription_item_details: {
                invoice_item: null,
                proration: false,
                proration_details: { credited_items: null },
                subscription: "sub_1SAT9J1tNDBT2PI2rgs8zKUH",
                subscription_item: "si_T6gWC1bFZMOyEr",
              },
              type: "subscription_item_details",
            },
            period: { end: 1761214119, start: 1758622119 },
            pretax_credit_amounts: [],
            pricing: {
              price_details: {
                price: "price_1S9S6j1tNDBT2PI2q3pSFUct",
                product: "prod_T5dNxr3suWPZsr",
              },
              type: "price_details",
              unit_amount_decimal: "100",
            },
            quantity: 1,
            taxes: [],
          },
        ],
        has_more: false,
        total_count: 1,
        url: "/v1/invoices/in_1SAT9H1tNDBT2PI2208PWaBx/lines",
      },
      livemode: false,
      metadata: {},
      next_payment_attempt: null,
      number: "STNN9EYN-0001",
      on_behalf_of: null,
      parent: {
        quote_details: null,
        subscription_details: {
          metadata: {},
          subscription: "sub_1SAT9J1tNDBT2PI2rgs8zKUH",
        },
        type: "subscription_details",
      },
      payment_settings: {
        default_mandate: null,
        payment_method_options: {
          acss_debit: null,
          bancontact: null,
          card: { request_three_d_secure: "automatic" },
          customer_balance: null,
          konbini: null,
          sepa_debit: null,
          us_bank_account: null,
        },
        payment_method_types: null,
      },
      period_end: 1758622119,
      period_start: 1758622119,
      post_payment_credit_notes_amount: 0,
      pre_payment_credit_notes_amount: 0,
      receipt_number: null,
      rendering: null,
      shipping_cost: null,
      shipping_details: null,
      starting_balance: 0,
      statement_descriptor: null,
      status: "paid",
      status_transitions: {
        finalized_at: 1758622119,
        marked_uncollectible_at: null,
        paid_at: 1758622120,
        voided_at: null,
      },
      subtotal: 100,
      subtotal_excluding_tax: 100,
      test_clock: null,
      total: 100,
      total_discount_amounts: [],
      total_excluding_tax: 100,
      total_pretax_credit_amounts: [],
      total_taxes: [],
      webhooks_delivered_at: 1758622119,
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: null,
    idempotency_key: "f858cca5-e1dc-4021-81cf-44a2f7aed8a5",
  },
  type: "invoice.paid",
};
