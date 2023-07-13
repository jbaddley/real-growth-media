import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const articleTypes = await prisma.articleType.createMany({
      data,
    });

    if (!articleTypes) {
      return NextResponse.json({ data: null, message: "Article types could not be created.", status: "error" });
    }

    return NextResponse.json({ data: articleTypes, message: `Article types created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article types Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Article types could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
