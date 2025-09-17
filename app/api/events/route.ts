import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

import { database, databaseId } from "@/appwrite/serverConfig";
import { headers } from "@/lib/constants";
import { getGeo, normalizeBrowser, normalizeOS } from "@/lib/utils/server";

export async function POST(req: NextRequest) {
  try {
    const {
      websiteId,
      href,
      referrer,
      viewport,
      visitorId,
      sessionId,
      adClickIds,
      type,
    } = await req.json();

    const userAgent = req.headers.get("user-agent") || "";

    const parser = new UAParser(userAgent);
    const browser = normalizeBrowser(parser.getBrowser().name);
    const os = normalizeOS(parser.getOS().name);
    const device = parser.getDevice().type || "desktop";

    let ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";

    ip = ip === "::1" ? "103.190.15.171" : ip;

    const geo = await getGeo(ip);

    // console.log("Received event data for", domain, {
    //   website: websiteId,
    //   href,
    //   referrer,
    //   viewport: JSON.stringify(viewport),
    //   visitorId,
    //   sessionId,
    //   type,
    //   browser,
    //   os,
    //   device,
    //   ip,
    //   countryCode: geo?.country,
    //   city: geo?.city,
    // });
    console.log({ device: device.type, os: os, browser: browser });
    const website = await database.getRow({
      databaseId,
      rowId: websiteId,
      tableId: "websites",
    });
    if (!website)
      throw new Error(
        "Website not found, please register it on  https://insightly.appwrite.network/dashboard/new "
      );

    await database.createRow({
      databaseId: databaseId,
      tableId: "events",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        href,
        referrer: referrer ? new URL(referrer).hostname : null,
        viewport: JSON.stringify(viewport),
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
  return NextResponse.json(null, {
    headers: headers,
  });
}
