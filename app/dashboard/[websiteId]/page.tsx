import { Metadata } from "next";

import Dashboard from "./components/dashboard";

import { database, databaseId } from "@/appwrite/serverConfig";

export default function Page() {
  return <Dashboard />;
}

type Props = {
  params: Promise<{ websiteId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch the website info (domain) from your DB or API
  const param = await params;
  const website = await database.getRow({
    databaseId,
    tableId: "websites",
    rowId: param.websiteId,
  });

  return {
    title: website.domain || "Dashboard",
  };
}
