import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import getHostname from "../../../../lib/getHostname";
import prisma from "../../../../lib/prismadb";
import getCategory from "../../../../lib/getCategory";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const category = await getCategory(params.categoryId);

    const articles = await prisma.article.findMany({
      where: {
        categoryId: category.id,
      },
    });

    if (!articles) {
      return NextResponse.json({ data: null, message: "Articles could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: articles, message: `Articles fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Articles fetch Error", e);
    return NextResponse.json({ data: null, message: "Article could not be fetched.", status: "error" });
  }
}

export async function POST(req: Request, { params }) {
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
    const category = await getCategory(params.categoryId);

    const data = await req.json();
    data.authorId = user?.id;
    data.hostname = hostname;
    data.categoryId = category.id;
    data.dateTime = new Date();

    const article = await prisma.article.create({
      data,
    });
    console.log({ article });

    if (!article) {
      return NextResponse.json({ data: null, message: "Article could not be created.", status: "error" });
    }

    return NextResponse.json({ data: article, message: `Article created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article Creation Error", e);
    return NextResponse.json({ data: null, message: "Article could not be created.", status: "error" });
  }
}
