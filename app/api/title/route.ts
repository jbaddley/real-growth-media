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
    const title = await prisma.title.findMany();

    if (!title) {
      return NextResponse.json({ data: null, message: "Title could not be found.", status: "error" });
    }

    return NextResponse.json({ data: title, message: `Title found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Title fetch Error", e);
    return NextResponse.json({ data: null, message: "Title could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const data = await req.json();

    const title = await prisma.title.create({
      data,
    });

    if (!title) {
      return NextResponse.json({ data: null, message: "Title could not be created.", status: "error" });
    }

    return NextResponse.json({ data: title, message: `Title created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Title Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Title could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
