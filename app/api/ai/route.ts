import { NextResponse } from "next/server";
import { writeTitles, getAdCopy } from "../../lib/writeAds";

export async function POST(req: Request, { params }) {
  const { context, title } = await req.json();
  let data;
  if (!title) {
    data = await writeTitles(context);
  } else {
    data = await getAdCopy(context, title);
  }
  return NextResponse.json({
    data,
    status: "error",
  });
}
