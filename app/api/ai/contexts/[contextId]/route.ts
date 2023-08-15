import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();

  const data = await prisma.context.findFirst({
    where: {
      id: contextId,
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
export async function DELETE(req: Request, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const data = await prisma.context.delete({
    where: {
      id: contextId,
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
export async function PUT(req: Request, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();
  const body = await req.json();

  const data = await prisma.context.update({
    where: {
      id: contextId,
    },
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
