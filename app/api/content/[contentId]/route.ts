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
    const content = await prisma.content.findFirst({
      where: {
        id: params.contentId,
      },
    });

    if (!content) {
      return NextResponse.json({ data: null, message: "Content could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: content, message: `Content fetched successfully.`, status: "ok" });
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
    const content = await prisma.content.update({
      where: {
        id: params.contentId,
      },
      data,
    });

    if (!content) {
      return NextResponse.json({ data: null, message: "Content could not be updated.", status: "error" });
    }

    return NextResponse.json({ data: content, message: `Content updated successfully.`, status: "ok" });
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
    await prisma.content.delete({
      where: {
        id: params.contentId,
      },
    });

    return NextResponse.json({ message: `Content deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Content Deleted Error", e);
    return NextResponse.json({ data: null, message: "Content could not be deleted.", status: "error" });
  }
}
