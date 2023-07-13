import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import getHostname from "../../lib/getHostname";
import prisma from "../../lib/prismadb";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const hostname = getHostname();

  try {
    const categories = await prisma.category.findMany({
      where: {
        hostname,
      },
    });

    if (!categories) {
      return NextResponse.json({ data: null, message: "Categories could not be found.", status: "error" });
    }

    return NextResponse.json({ data: categories, message: `Categories found successfully.`, status: "ok" });
  } catch (e) {
    console.error("Category fetch Error", e);
    return NextResponse.json({ data: null, message: "Categories could not be found.", status: "error" });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  try {
    const hostname = getHostname();

    const data = await req.json();
    data.hostname = hostname;
    console.log({ session, hostname, data });

    const category = await prisma.category.create({
      data,
    });

    if (!category) {
      return NextResponse.json({ data: null, message: "Category could not be created.", status: "error" });
    }

    return NextResponse.json({ data: category, message: `Category created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Category Creation Error", e);
    return NextResponse.json({
      data: null,
      message: `Category could not be created. Reason: ${e.message}`,
      status: "error",
    });
  }
}
