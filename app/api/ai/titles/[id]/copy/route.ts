import { NextResponse } from "next/server";
import { getAdCopy } from "../../../../../lib/writeAds";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const { context, title } = await req.json();
  const data = await getAdCopy(context, title);
  console.log({ data });
  return NextResponse.json({
    data,
    status: "error",
  });
}
