import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  // const { searchParams } = new URL(req.url);
  // const promptId = searchParams.get("promptId");

  const user = await currentUser();

  const data = await prisma.brandIdea.findMany({
    where: {
      contextId: contextId,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
