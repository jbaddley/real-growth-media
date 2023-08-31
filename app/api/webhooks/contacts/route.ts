import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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
