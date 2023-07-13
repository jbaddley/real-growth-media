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
    const articleType = await prisma.articleType.findMany();

    if (!articleType) {
      return NextResponse.json({ data: null, message: "Article type could not be found.", status: "error" });
    }

    return NextResponse.json({ data: articleType, message: `Article type found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article type fetch Error", e);
    return NextResponse.json({ data: null, message: "Article type could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const articleType = await prisma.articleType.create({
      data,
    });

    if (!articleType) {
      return NextResponse.json({ data: null, message: "Article type could not be created.", status: "error" });
    }

    return NextResponse.json({ data: articleType, message: `Article type created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article type Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Article type could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
