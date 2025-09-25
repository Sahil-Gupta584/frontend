/* eslint-disable */
import { faker } from "@faker-js/faker";
// import fs from "fs";
import { Client, ID, Query, TablesDB } from "node-appwrite";

const rawDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!rawDatabaseId)
  throw new Error("Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID in .env");

const databaseId: string = rawDatabaseId;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const projectKey = process.env.APPWRITE_KEY;

if (!projectId)
  throw new Error("Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID in .env");

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(projectKey!);

const database = new TablesDB(client);
// const websiteId = "68c43ddf0011d1180361";
const websiteId = "68d124eb001034bd8493"; //sahil99

const startDate = new Date("2025-09-15");
const endDate = new Date();

const baseEventsPerDay = 300;
const revenueChance = 0.2; // 5% of sessions generate revenue

const eventTypes = [
  { type: "pageview", weight: 70 },
  { type: "click", weight: 20 },
  { type: "signup", weight: 5 },
  { type: "purchase", weight: 5 },
];

const countries = [
  { code: "IN", city: "Delhi", region: "DL", weight: 70 },
  { code: "US", city: "New York", region: "NY", weight: 10 },
  { code: "DE", city: "Berlin", region: "BE", weight: 10 },
  { code: "GB", city: "London", region: "LN", weight: 10 },
];

const hrefs = [
  { href: "/dashboard", weight: 50 },
  { href: "/", weight: 30 },
  { href: "/auth", weight: 20 },
];

const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
const devices = ["desktop", "mobile", "tablet"];
const viewports: Record<string, string[]> = {
  desktop: ["1920x1080", "1366x768", "1600x900"],
  mobile: ["375x667", "414x896", "360x800"],
  tablet: ["768x1024", "800x1280", "834x1112"],
};
const referrers = [
  "https://x.com",
  "https://instagram.com",
  "https://google.com",
  "https://youtube.com",
];

// Weighted random helper
function weightedRandom<T extends { weight: number }>(arr: T[]) {
  const totalWeight = arr.reduce((sum, item) => sum + item.weight, 0);
  let rnd = Math.random() * totalWeight;

  for (const item of arr) {
    if (rnd < item.weight) return item;
    rnd -= item.weight;
  }

  return arr[0];
}

// Random date with peak traffic (10 AM – 10 PM)
function randomDateWithPeak(dayStart: Date, dayEnd: Date) {
  const peakHour = faker.number.int({ min: 10, max: 22 });
  const minutes = faker.number.int({ min: 0, max: 59 });
  const seconds = faker.number.int({ min: 0, max: 59 });

  return new Date(
    dayStart.getFullYear(),
    dayStart.getMonth(),
    dayStart.getDate(),
    peakHour,
    minutes,
    seconds
  ).toISOString();
}

async function generateDummyData() {
  const events: any[] = [];
  const revenues: any[] = [];

  for (
    let d = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    // Random daily visitors (more fluctuation)
    const visitorsToday = Array.from(
      { length: faker.number.int({ min: 10, max: 80 }) }, // wider range
      () => faker.string.uuid()
    );

    const sessionsToday = Array.from(
      {
        length: faker.number.int({
          min: visitorsToday.length,
          max: visitorsToday.length * 3,
        }),
      }, // 1–3 sessions per visitor
      () => faker.string.uuid()
    );

    // Events per day proportional to sessions + random spike
    const eventsToday =
      sessionsToday.length * faker.number.int({ min: 3, max: 6 }); // 3–6 events per session

    const dayStart = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0
    );
    const dayEnd = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999
    );

    for (let i = 0; i < eventsToday; i++) {
      const visitorId = faker.helpers.arrayElement(visitorsToday);
      const sessionId = faker.helpers.arrayElement(sessionsToday);

      const country = weightedRandom(countries);
      const eventType = weightedRandom(eventTypes).type;
      const href = weightedRandom(hrefs).href;
      const device = faker.helpers.arrayElement(devices);
      const viewport = faker.helpers.arrayElement(viewports[device]);

      const event = {
        type: eventType,
        website: websiteId,
        href: `https://syncmate.xyz${href}`,
        visitorId,
        sessionId,
        referrer: faker.helpers.arrayElement(referrers),
        os: faker.helpers.arrayElement([
          "linux",
          "windows",
          "macos",
          "ios",
          "android",
        ]),
        browser: faker.helpers.arrayElement(browsers),
        countryCode: country.code,
        city: country.city,
        region: country.region,
        device,
        $createdAt: randomDateWithPeak(dayStart, dayEnd),
      };

      events.push(event);
      if (Math.random() < revenueChance && eventType === "purchase") {
        const baseRevenue = faker.number.int({ min: 10, max: 100 });

        // Renewal revenue (20–50% of the base revenue, but not always present)
        const hasRenewal = Math.random() < 0.3; // ~30% of purchases lead to renewal
        const renewalRevenue = hasRenewal
          ? Math.round(baseRevenue * faker.number.float({ min: 0.2, max: 0.5 }))
          : 0;

        // Refunded revenue (rare, 5% chance)
        const isRefunded = Math.random() < 0.05;
        const refundedRevenue = isRefunded
          ? Math.round(baseRevenue * faker.number.float({ min: 0.2, max: 1.0 }))
          : 0;

        // Customers (simulate 1–3 new customers per purchase event)
        const customers = faker.number.int({ min: 1, max: 3 });

        // Sales = base + renewal - refund
        const sales = baseRevenue + renewalRevenue - refundedRevenue;

        revenues.push({
          website: websiteId,
          sessionId,
          visitorId,
          revenue: baseRevenue,
          renewalRevenue,
          refundedRevenue,
          customers,
          sales,
          eventType: "purchase",
          $createdAt: event.$createdAt,
        });
      }
    }
  }

  // Save to files (optional)
  // fs.writeFileSync(
  //   "events.ts",
  //   `export const eventsData =${JSON.stringify(events, null, 2)}`
  // );
  // fs.writeFileSync(
  //   "revenues.ts",
  //   `export const revenuesData =${JSON.stringify(revenues, null, 2)}`
  // );

  console.log(
    `Generated ${events.length} events & ${revenues.length} revenues`
  );
}
async function seed(tableId: string, data: any[]) {
  const chunkSize = 50;

  for (let [i, row] of data?.entries()) {
    // delete row?.viewport;
    if (row?.$createdAt > new Date().toISOString()) continue;
    await database.createRow({
      databaseId,
      tableId,
      rowId: ID.unique(),
      data: row,
    });
    console.log(`Inserted ${i} into ${tableId}`);
  }
}

async function deleterows() {
  const res = await database.deleteRows({
    databaseId,
    tableId: "events",
    queries: [Query.equal("website", websiteId)],
  });

  console.log("Deleted events:", res.total);
}
// deleterows();
// generateDummyData();
// seed("events", eventsData);
// seed("revenues", revenuesData);
// seed('revenues', (await generateDummyData()).revenues);
const MODE = process.env.NEXT_PUBLIC_MODE || "dev";

export { database, databaseId, MODE };
