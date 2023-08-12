import { NextResponse } from "next/server";
import { getAdCopy } from "../../../../../lib/writeAds";

export async function POST(req: Request) {
  const { context, title } = await req.json();
  const data = await getAdCopy(context, title);
  console.log({ data });
  return NextResponse.json({
    data,
    status: "error",
  });
}
