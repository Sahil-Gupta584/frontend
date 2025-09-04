import { account } from "@/appwrite/clientConfig";
import { database } from "@/appwrite/serverConfig";
import { ID } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { domain, timezone } = await req.json();
    const user = await account.get();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const result = await database.createRow({
      databaseId: "68b2b44d003465280f37",
      tableId: "68b2b466000179a3332c",
      rowId: ID.unique(),
      data: { domain, timezone, userId: user.$id },
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message });
  }
}
