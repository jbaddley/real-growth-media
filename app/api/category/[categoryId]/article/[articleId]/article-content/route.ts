import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../auth/[...nextauth]/route";
import prisma from "../../../../../../lib/prismadb";
import { ArticleContent } from "@prisma/client";
import getArticle from "../../../../../../lib/getArticle";

export async function GET(req: Request, { params }) {
  const session = await getServerSession(authOptions);
  console.log({ here: true });

  if (!session) {
    return NextResponse.json({ message: "You are not logged in?", status: "error" });
  }

  try {
    const article = await getArticle(params.articleId);
    const articleContent = await prisma.articleContent.findMany({
      where: {
        articleId: article.id,
      },
      include: {
        title: true,
        hero: true,
        content: true,
        callToAction: true,
        type: true,
      },
    });

    if (!articleContent) {
      return NextResponse.json({ data: null, message: "Article content could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: articleContent, message: `Content fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article content fetch Error", e);
    return NextResponse.json({ data: null, message: "Article content could not be fetched.", status: "error" });
  }
}

export async function POST(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    const article = await getArticle(params.articleId);
    console.log({ article });
    const data: ArticleContent = await req.json();
    data.articleId = article.id;
    const articleContent = await prisma.articleContent.create({
      data,
    });

    if (!articleContent) {
      return NextResponse.json({ data: null, message: "Article content could not be created.", status: "error" });
    }

    return NextResponse.json({ data: articleContent, message: `Article content created successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article content Creation Error", e);
    return NextResponse.json({ data: null, message: "Article content could not be created.", status: "error" });
  }
}
