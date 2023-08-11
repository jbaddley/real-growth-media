import { NextResponse } from "next/server";
import { writeTitles } from "../../../lib/writeAds";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const { context } = await req.json();
  const data = await writeTitles(context);
  return NextResponse.json({
    data,
    status: "error",
  });
}
