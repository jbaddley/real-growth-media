import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();

  const data = await prisma.context.findMany({
    where: {
      email: {
        equals: user.emailAddresses[0].emailAddress,
      },
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();
  const body = await req.json();

  const data = await prisma.context.create({
    data: {
      data: body.data,
      name: body.name,
      email: user.emailAddresses[0].emailAddress,
      options: body.options,
    },
  });

  return NextResponse.json({
    data,
    status: "success",
  });
}
