import { Account, Client } from "appwrite";

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("68ad713f00087b77096f");

const account = new Account(client);
export { account };
