import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import getHostname from "../../../../../lib/getHostname";
import prisma from "../../../../../lib/prismadb";
import getArticle from "../../../../../lib/getArticle";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in!", status: "error" });
  }

  try {
    console.log({ articleId: params.articleId });
    const article = await getArticle(params.articleId);
    console.log({ article });
    if (!article) {
      return NextResponse.json({ data: null, message: "Article could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: article, message: `Article fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article Creation Error", e);
    return NextResponse.json({ data: null, message: "Article could not be fetched.", status: "error" });
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
    const articleToUpdate = await getArticle(params.articleId);

    const data = await req.json();
    data.hostname = hostname;
    const article = await prisma.article.update({
      where: {
        id: articleToUpdate.id,
      },
      data,
    });

    if (!article) {
      return NextResponse.json({ data: null, message: "Article could not be created.", status: "error" });
    }

    return NextResponse.json({ data: article, message: `Article created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article Creation Error", e);
    return NextResponse.json({ data: null, message: "Article could not be created.", status: "error" });
  }
}

export async function DELETE(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const article = await getArticle(params.articleId);

    await prisma.article.delete({
      where: {
        id: article.id,
      },
    });

    return NextResponse.json({ message: `Article deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article Deleted Error", e);
    return NextResponse.json({ data: null, message: "Article could not be deleted.", status: "error" });
  }
}
