import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  console.log({ id });
  let proposal = await prisma.proposals.findFirst({
    where: {
      id,
    },
  });

  console.log({ proposal });

  return NextResponse.json({
    data: proposal,
    status: "success",
  });
}
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
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
