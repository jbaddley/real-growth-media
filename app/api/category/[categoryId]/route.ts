import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import getHostname from "../../../lib/getHostname";
import prisma from "../../../lib/prismadb";
import getCategory from "../../../lib/getCategory";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const hostname = getHostname();

  console.log({ session, hostname });

  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email,
    },
  });

  try {
    const category = await getCategory(params.categoryId);

    if (!category) {
      return NextResponse.json({ data: null, message: "Category could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: category, message: `Category fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Category Fetched Error", e);
    return NextResponse.json({ data: null, message: "Category could not be fetched.", status: "error" });
  }
}
export async function PUT(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const hostname = getHostname();

  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email,
    },
  });

  try {
    const categoryToUpdate = await getCategory(params.categoryId);

    const data = await req.json();
    data.hostname = hostname;
    const category = await prisma.category.update({
      where: {
        id: categoryToUpdate.id,
      },
      data,
    });

    if (!category) {
      return NextResponse.json({ data: null, message: "Category could not be updated.", status: "error" });
    }

    return NextResponse.json({ data: category, message: `Category updated successfully.`, status: "ok" });
  } catch (e) {
    console.error("Category Update Error", e);
    return NextResponse.json({ data: null, message: "Category could not be updated.", status: "error" });
  }
}

export async function DELETE(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in." });
  }

  try {
    const category = await getCategory(params.categoryId);

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    return NextResponse.json({ message: `Category deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Category Deleted Error", e);
    return NextResponse.json({ data: null, message: "Category could not be deleted.", status: "error" });
  }
}
