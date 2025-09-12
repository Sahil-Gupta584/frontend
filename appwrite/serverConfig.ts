import { faker } from "@faker-js/faker";
import { Client, ID, TablesDB } from "node-appwrite";

// ---- Appwrite Config ----

const databaseId: string = process.env
  .NEXT_PUBLIC_APPWRITE_DATABASE_ID as string; // your DB id
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const websitesTableId = "websites";
const projectKey = process.env.APPWRITE_KEY;
if (!projectId || !databaseId) throw new Error("Invalid envs");

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(projectId)
  .setKey(projectKey!);

const database = new TablesDB(client);

// ---- Config for dummy data ----
const domain = "syncmate.xyz";
const websiteId = "68c43ddf0011d1180361"; //jjugnee

const startDate = new Date("2025-03-01");
const endDate = new Date("2025-09-12"); // today
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

// for (
//   let d = new Date(startDate);
//   d <= endDate;
//   d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
// ) {
//   const year = d.getFullYear();
//   const month = d.getMonth();

//   // Events spread month by month
//   for (let i = 0; i < eventsPerMonth; i++) {
//     const visitorId = faker.string.uuid();
//     const sessionId = faker.string.uuid();
//     const country = faker.helpers.arrayElement(countries);

//     events.push({
//       type: faker.helpers.arrayElement(eventTypes),
//       website: websiteId,
//       href: faker.internet.url(),
//       visitorId,
//       sessionId,
//       viewport: faker.helpers.arrayElement([
//         "1920x1080",
//         "1366x768",
//         "375x812",
//       ]),
//       referrer: faker.internet.url(),
//       os: faker.helpers.arrayElement([
//         "Linux",
//         "Windows",
//         "macOS",
//         "iOS",
//         "Android",
//       ]),
//       browser: faker.helpers.arrayElement(browsers),
//       countryCode: country.code,
//       city: country.city,
//       region: country.region,
//       device: faker.helpers.arrayElement(devices),
//       $createdAt: randomDateInMonth(year, month),
//     });
//   }

//   // Revenues spread across entire range
//   for (let j = 0; j < revenueEventsPerMonth; j++) {
//     const visitorId = faker.string.uuid();
//     const sessionId = faker.string.uuid();

//     revenues.push({
//       website: websiteId,
//       eventType: "purchase",
//       revenue: faker.number.int({ min: 10, max: 200 }),
//       renewalRevenue: faker.number.int({ min: 0, max: 100 }),
//       refundedRevenue: faker.number.int({ min: 0, max: 50 }),
//       customers: 1,
//       sales: 1,
//       sessionId,
//       visitorId,
//       $createdAt: randomDateInRange(startDate, endDate),
//     });
//   }
// }

// console.log(`Generated ${events.length} events & ${revenues.length} revenues`);

// // ---- Save to JSON files ----
// fs.writeFileSync("events.json", JSON.stringify(events, null, 2));
// fs.writeFileSync("revenues.json", JSON.stringify(revenues, null, 2));
// console.log("Data saved to events.json and revenues.json");

// ---- Seeder ----
async function seed(tableId: string, data: any[]) {
  const chunkSize = 50;
  for (let i = 11050; i < data.length; i += chunkSize) {
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
// seed("events", eventsData);
// seed("revenues", revenuesData);

// async function replace() {
//   await database.listRows({ databaseId, tableId: "events" });
// }
// replace();
export { database, databaseId, websitesTableId };
