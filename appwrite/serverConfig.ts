import { faker } from "@faker-js/faker";
import { Client, ID, Query, TablesDB } from "node-appwrite";
export const MODE = process.env.NEXT_PUBLIC_MODE;
// ---- Appwrite Config ----
const rawDatabaseId = "68cbc63100188b1cf674";
if (!rawDatabaseId) throw new Error("Invalid envs");

const databaseId: string = rawDatabaseId;
const projectId = "68ad713f00087b77096f";
const websitesTableId = "websites";
const projectKey =
  "standard_0f5fb3432024560fe5f818d405fca7dcc6f62174013950cd6ee46836a308d608040b6bc6447cb5de7e39cd2117629f50554411b96f705fcd2dbd2e745bc20a1f48827e8fd022d13b2d5bbdcfef4e6c628ff8a2e84679a594afd5ff1baf1404dd98bbddd83e2a9c91a348f08866b98122bcdca0e6069ef7db5972b7703366ecb6";
if (!projectId || !databaseId) throw new Error("Invalid envs");

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(projectKey!);

const database = new TablesDB(client);

// ---- Config for dummy data ----
const domain = "syncmate.xyz";
const websiteId = "68c43ddf0011d1180361"; //jjugnee

const endDate = new Date(); // today
const startDate = new Date();
startDate.setMonth(endDate.getMonth() - 1);
const eventsPerMonth = 3000;
const revenueEventsPerMonth = 50;

const eventTypes = ["pageview", "click", "signup", "purchase"];
const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
const devices = ["desktop", "mobile", "tablet"];
const countries = [
  { code: "US", city: "New York", region: "NY" },
  { code: "IN", city: "Delhi", region: "DL" },
  { code: "DE", city: "Berlin", region: "BE" },
  { code: "GB", city: "London", region: "LN" },
];
const referrers = [
  "https://x.com",
  "https://instagram.com",
  "https://google.com",
  "https://youtube.com",
];
const href = ["/auth", "/", "/dashboard"];
// ---- Helpers ----
function randomDateInMonth(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59);
  return faker.date.between({ from: start, to: end }).toISOString();
}

function randomDateInRange(start: Date, end: Date) {
  return faker.date.between({ from: start, to: end }).toISOString();
}

// ---- Generate events & revenues ----
let events: any[] = [];
let revenues: any[] = [];

function generate() {
  for (
    let d = new Date(startDate);
    d <= endDate;
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  ) {
    const year = d.getFullYear();
    const month = d.getMonth();

    // Events spread month by month
    for (let i = 0; i < eventsPerMonth; i++) {
      const visitorId = faker.string.uuid();
      const sessionId = faker.string.uuid();
      const country = faker.helpers.arrayElement(countries);

      events.push({
        type: faker.helpers.arrayElement(eventTypes),
        website: websiteId,
        href: `https://syncmate.xyz${href[faker.number.int({ min: 0, max: 2 })]}`,
        visitorId,
        sessionId,
        viewport: faker.helpers.arrayElement([
          "1920x1080",
          "1366x768",
          "375x812",
        ]),
        referrer: referrers[faker.number.int({ min: 0, max: 3 })],
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
        device: faker.helpers.arrayElement(devices),
        $createdAt: randomDateInMonth(year, month),
      });
    }

    // Revenues spread across entire range
    for (let j = 0; j < revenueEventsPerMonth; j++) {
      const visitorId = faker.string.uuid();
      const sessionId = faker.string.uuid();

      revenues.push({
        website: websiteId,
        eventType: "purchase",
        revenue: faker.number.int({ min: 10, max: 100 }),
        renewalRevenue: faker.number.int({ min: 0, max: 100 }),
        refundedRevenue: faker.number.int({ min: 0, max: 50 }),
        customers: 1,
        sales: 1,
        sessionId,
        visitorId,
        $createdAt: randomDateInRange(startDate, endDate),
      });
    }
  }

  console.log(
    `Generated ${events.length} events & ${revenues.length} revenues`
  );

  // ---- Save to JSON files ----
  // fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
  // fs.writeFileSync("revenues.json", JSON.stringify(revenues, null, 2));
  console.log("Data saved to events.json and revenues.json");
}
// ---- Seeder ----
const sids = [
  "5cb8431f-cf82-4cbf-8950-be60e4db3507",
  "caf14091-d62b-435c-b5b2-660ea24bac66",
  "6ac63a1a-b68f-40c8-b0ef-6ac0dec19d99",
  "cd260f3a-3b79-4487-8714-3153c74e7bd8",
  "eefcb2bc-841e-4914-8777-c97896ce9dc3",
  "8fb61fc2-06db-4bc9-8187-25c829574f9e",
  "fcdb2017-4ddf-4751-a558-8854f6f5ac2a",
  "2362c2a3-c716-4002-b1e9-4aac76b566d3",
  "79a36f0d-a4f2-4e4c-a821-3c60e9e85ff6",
  "24a70ed1-9489-450a-9a01-ffef97206728",
];
const vids = [
  "29ec95d9-b4ff-491b-9836-dc6067e54dd0",
  "78a9dd80-a6aa-454d-afb9-1efc89a12268",
  "e3febfc2-364e-4625-90e0-8252edcffdb9",
  "4dfb9840-937e-4ee0-a23f-d39c81b4243c",
  "659147f7-fdef-45e9-8669-bbd837963355",
  "8a44c2dc-02ca-431b-8e2b-571109fb19ce",
  "65e26d6e-789b-4cc2-b1e9-de1410663961",
  "65e26d6e-789b-4cc2-b1e9-de1410663961",
  "a85cf9a1-0364-4df9-b02e-6cd224b4f023",
  "a5e8c86b-a04b-4563-9b7d-7baec7d049a4",
];

async function createvents() {
  for (let i = 200; i >= 0; i--) {
    const country = faker.helpers.arrayElement(countries);

    await database.createRow({
      databaseId,
      tableId: "events",
      rowId: ID.unique(),
      data: {
        type: faker.helpers.arrayElement(eventTypes),
        website: websiteId,
        href: `https://syncmate.xyz${href[faker.number.int({ min: 0, max: 2 })]}`,
        visitorId: faker.helpers.arrayElement(vids),
        sessionId: faker.helpers.arrayElement(sids),
        viewport: faker.helpers.arrayElement([
          "1920x1080",
          "1366x768",
          "375x812",
        ]),
        referrer: referrers[faker.number.int({ min: 0, max: 3 })],
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
        device: faker.helpers.arrayElement(devices),
        $createdAt: new Date("2025-9-19").toISOString(),
      },
    });
    console.log(`Inserted ${i}`);
  }
}
// createvents();
async function seed(tableId: string, data: any[]) {
  const chunkSize = 50;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map((row) =>
        database.createRow({
          databaseId,
          tableId,
          rowId: ID.unique(),
          data: row,
        })
      )
    );
    console.log(`Inserted ${i + chunk.length}/${data.length} into ${tableId}`);
  }
}

// Uncomment to seed into Appwrite
// seed("revenues", revenuesData);
// seed("revenues", revenuesData);

// async function replace() {
//   await database.listRows({ databaseId, tableId: "events" });
// }
// replace();
async function deleterows() {
  const res = await database.deleteRows({
    databaseId,
    tableId: "events",
    queries: [
      Query.greaterThanEqual(
        "$createdAt",
        new Date("2025-09-18").toISOString()
      ),
    ],
  });
  // console.log("deleted", res.total);
}
// deleterows();
export { database, databaseId, websitesTableId };
