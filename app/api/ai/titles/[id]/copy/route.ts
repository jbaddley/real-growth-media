import { NextResponse } from "next/server";
import { getAdCopy } from "../../../../../lib/writeAds";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
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
