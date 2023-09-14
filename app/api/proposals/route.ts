import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: NextRequest, res: NextResponse) {
  let proposals = await prisma.proposals.findMany();

  return NextResponse.json({
    data: proposals,
    status: "success",
  });
}
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  body.currentAdSpend = +(body.currentAdSpend || 0);
  let proposal = await prisma.proposals.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!proposal) {
    proposal = await prisma.proposals.create({
      data: body,
    });
  } else {
    proposal = await prisma.proposals.update({
      where: {
        id: proposal.id,
      },
      data: { ...proposal, ...body },
    });
  }

  return NextResponse.json({
    data: proposal,
    status: "success",
  });
}
