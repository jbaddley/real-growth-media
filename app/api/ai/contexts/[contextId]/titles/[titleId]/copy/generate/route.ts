import { NextResponse } from "next/server";
import { generateCopyIdeas } from "../../../../../../../../lib/writeAds";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId, titleId } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const user = await currentUser();

  const data = await generateCopyIdeas(contextId, user.emailAddresses[0].emailAddress, titleId, 5);
  return NextResponse.json({
    data,
    status: "error",
  });
}
