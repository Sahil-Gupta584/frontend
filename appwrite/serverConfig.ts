import { Client, TablesDB } from "node-appwrite";

const databaseIdRaw = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

if (!databaseIdRaw) throw new Error("Missing DATABASE_ID");
const databaseId: string = databaseIdRaw;

const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

const websitesTableId = process.env.WEBSITE_TABLE_ID || "";
const projectKey = process.env.APPWRITE_KEY || "";

if (!databaseId || !projectId || !databaseId) {
  throw new Error("Invalid envs");
}

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(projectId)
  .setKey(projectKey);

const database = new TablesDB(client);

// async function migrate() {
//   const res = await database.listDocuments(databaseId, "events");
//   for (const doc of res.documents) {
//     if (!doc.os) {
//       console.log("updating", doc.$id);

//       await database.updateDocument(databaseId, "events", doc.$id, {
//         os: "Linux",
//         browser: "Chrome",
//         countryCode: "US",
//         city: "San Francisco",
//         region: "California",
//         device: "mobile",
//       });
//     }
//   }
// }

// migrate();

export { database, databaseId, websitesTableId };
