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

    const titles = await prisma.title.createMany({
      data,
    });

    if (!titles) {
      return NextResponse.json({ data: null, message: "Titles could not be created.", status: "error" });
    }

    return NextResponse.json({ data: titles, message: `Titles created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Titles Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Titles could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
