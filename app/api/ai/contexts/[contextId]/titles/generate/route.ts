import { NextResponse } from "next/server";
import { generateTitles, getPromptFromContext, writeTitles } from "../../../../../../lib/writeAds";
import { auth, currentUser } from "@clerk/nextjs";
import { AdTitle, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId } }) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  console.log({ brand, model });
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();

  const adTitles = await generateTitles(contextId, user.emailAddresses[0].emailAddress, brand, model, 5);

  return NextResponse.json({
    data: adTitles,
    status: "error",
  });
}
