import { NextResponse } from "next/server";
import { writeTitles } from "../../../lib/writeAds";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const { context } = await req.json();
  const data = await writeTitles(context);
  return NextResponse.json({
    data,
    status: "error",
  });
}
