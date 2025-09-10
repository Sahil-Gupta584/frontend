import { Account, Client } from "appwrite";

if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  throw new Error("Invalid appwrite project url");

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);

export { account, client };
