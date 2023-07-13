import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "../../lib/prismadb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const content = await prisma.content.findMany();

    if (!content) {
      return NextResponse.json({ data: null, message: "Content could not be found.", status: "error" });
    }

    return NextResponse.json({ data: content, message: `Content found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content fetch Error", e);
    return NextResponse.json({ data: null, message: "Content could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const content = await prisma.content.create({
      data,
    });

    if (!content) {
      return NextResponse.json({ data: null, message: "Content could not be created.", status: "error" });
    }

    return NextResponse.json({ data: content, message: `Content created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Content could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
