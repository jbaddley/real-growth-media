import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params: { id } }, res: NextResponse) {
  let proposal = await prisma.proposals.findFirst({
    where: {
      id,
    },
  });

  return NextResponse.json({
    data: proposal,
    status: "success",
  });
}
export async function DELETE(req: NextRequest, { params: { id } }, res: NextResponse) {
  await prisma.proposals.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    data: null,
    status: "success",
  });
}
