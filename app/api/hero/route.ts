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
    const hero = await prisma.hero.findMany();

    if (!hero) {
      return NextResponse.json({ data: null, message: "Hero could not be found.", status: "error" });
    }

    return NextResponse.json({ data: hero, message: `Hero found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Hero fetch Error", e);
    return NextResponse.json({ data: null, message: "Hero could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const hero = await prisma.hero.create({
      data,
    });

    if (!hero) {
      return NextResponse.json({ data: null, message: "Hero could not be created.", status: "error" });
    }

    return NextResponse.json({ data: hero, message: `Hero created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Hero Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Hero could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
