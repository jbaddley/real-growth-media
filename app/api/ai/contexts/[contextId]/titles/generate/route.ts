import { NextResponse } from "next/server";
import { generateTitles } from "../../../../../../lib/writeAds";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();

  const adTitles = await generateTitles(contextId, user.emailAddresses[0].emailAddress, 5);

  return NextResponse.json({
    data: adTitles,
    status: "error",
  });
}
