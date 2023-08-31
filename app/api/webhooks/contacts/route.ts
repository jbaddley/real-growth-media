import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  let contact = await prisma.contact.findFirst({
    where: {
      email,
    },
  });

  return NextResponse.json({
    data: contact,
    status: "success",
  });
}
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  let contact = await prisma.contact.findFirst({
    where: {
      email: body.email,
    },
  });

  if (!contact) {
    contact = await prisma.contact.create({
      data: body,
    });
  } else {
    contact = await prisma.contact.update({
      where: {
        email: body.email,
      },
      data: { ...contact, ...body },
    });
  }

  return NextResponse.json({
    data: contact,
    status: "success",
  });
}
