import { NextResponse } from "next/server";
import { getAdCopy, getPromptFromContext } from "../../../../../../lib/writeAds";
import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { brandId } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const data = await prisma.brandIdea.findFirst({
    where: {
      id: brandId,
    },
  });
  return NextResponse.json({
    data,
    status: "error",
  });
}

export async function DELETE(req: Request, { params: { brandId } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const data = await prisma.brandIdea.delete({
    where: {
      id: brandId,
    },
  });
  return NextResponse.json({
    data,
    status: "error",
  });
}
