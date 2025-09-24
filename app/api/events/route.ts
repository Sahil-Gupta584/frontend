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
