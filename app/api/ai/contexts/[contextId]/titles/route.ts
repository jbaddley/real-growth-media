import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { AdTitle, PrismaClient } from "@prisma/client";
import { generateTitles, getPromptFromContext, writeTitles } from "../../../../../lib/writeAds";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId } }) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const user = await currentUser();

  let data = await prisma.adTitle.findMany({
    where: {
      contextId,
    },
  });

  // if (!data.length) {
  //   await generateTitles(contextId, user.emailAddresses[0].emailAddress, brand, model, 5);
  //   data = await prisma.adTitle.findMany({
  //     where: {
  //       contextId,
  //     },
  //   });
  // }
  return NextResponse.json({
    data: data || [],
    status: "error",
  });
}
