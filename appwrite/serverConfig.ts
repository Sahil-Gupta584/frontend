import { Client, TablesDB } from "node-appwrite";

export const databaseId = "68b2b44d003465280f37";
export const websitesCollectionId = "68b2b466000179a3332c";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("68ad713f00087b77096f")
  .setKey(
    "standard_0f5fb3432024560fe5f818d405fca7dcc6f62174013950cd6ee46836a308d608040b6bc6447cb5de7e39cd2117629f50554411b96f705fcd2dbd2e745bc20a1f48827e8fd022d13b2d5bbdcfef4e6c628ff8a2e84679a594afd5ff1baf1404dd98bbddd83e2a9c91a348f08866b98122bcdca0e6069ef7db5972b7703366ecb6"
  );

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

export { database };
