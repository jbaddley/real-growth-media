import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../../lib/prismadb";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const title = await prisma.title.findFirst({
      where: {
        id: params.titleId,
      },
    });

    if (!title) {
      return NextResponse.json({ data: null, message: "Content could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: title, message: `Content fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content Fetched Error", e);
    return NextResponse.json({ data: null, message: "Content could not be fetched.", status: "error" });
  }
}
export async function PUT(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const data = await req.json();
    const title = await prisma.title.update({
      where: {
        id: params.titleId,
      },
      data,
    });

    if (!title) {
      return NextResponse.json({ data: null, message: "Content could not be updated.", status: "error" });
    }

    return NextResponse.json({ data: title, message: `Content updated successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content Update Error", e);
    return NextResponse.json({ data: null, message: "Content could not be updated.", status: "error" });
  }
}

export async function DELETE(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    await prisma.title.delete({
      where: {
        id: params.titleId,
      },
    });

    return NextResponse.json({ message: `Content deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content Deleted Error", e);
    return NextResponse.json({ data: null, message: "Content could not be deleted.", status: "error" });
  }
}
