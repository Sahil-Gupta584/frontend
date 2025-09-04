import { database, databaseId } from "@/appwrite/serverConfig";
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
  try {
    const {
      websiteId,
      domain,
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
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    let ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "0.0.0.0";
    ip = ip === "::1" ? "103.190.15.171" : ip;

    const geo = await getGeo(ip);
    console.log({ geo });

    console.log("Received event data for", domain, {
      website: websiteId,
      href,
      referrer,
      viewport: JSON.stringify(viewport),
      visitorId,
      sessionId,
      type,
      browser,
      os,
      device,
      ip,
      countryCode: geo?.country,
      city: geo?.city,
    });

    await database.createRow({
      databaseId: databaseId,
      tableId: "events",
      rowId: ID.unique(),
      data: {
        website: websiteId,
        href,
        referrer: new URL(referrer).hostname,
        viewport: JSON.stringify(viewport),
        visitorId,
        sessionId,
        type,
        browser: browser.name,
        os: os.name,
        device: device.type || "desktop",
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

// 👇 This handles the preflight request
export async function OPTIONS() {
  return NextResponse.json(null, {
    headers,
  });
}

async function getGeo(ip: string) {
  try {
    const token = process.env.IP_INFO_TOKEN;
    if (!token) console.error("Invalid ipinfo token");
    const url = `https://ipinfo.io/${ip}?token=${token}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) return null;
    return data;
  } catch (error) {
    console.log("Error to get Geo", error);

    return null;
  }
}
