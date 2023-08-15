import { NextResponse } from "next/server";
import { generateCopyIdeas, getAdCopy, getPromptFromContext } from "../../../../../../../lib/writeAds";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId, titleId } }) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const user = await currentUser();
  let adCopy = await prisma.adCopy.findMany({
    where: {
      adTitleId: titleId,
      contextId,
    },
  });
  // if (!adCopy.length) {
  //   await generateCopyIdeas(contextId, user.emailAddresses[0].emailAddress, titleId, brand, model, 5);
  //   adCopy = await prisma.adCopy.findMany({
  //     where: {
  //       adTitleId: titleId,
  //       contextId,
  //     },
  //   });
  // }
  return NextResponse.json({
    data: adCopy,
    status: "success",
  });
}
