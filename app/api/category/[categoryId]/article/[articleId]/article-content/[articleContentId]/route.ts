import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../../auth/[...nextauth]/route";
import prisma from "../../../../../../../lib/prismadb";
import { ArticleContentFields } from "../../../../../../../lib/types/ArticleContentFields";
import { ArticleContentExpanded } from "../../../../../../../lib/types/ArticleContentExpanded";
import dayjs from "dayjs";

export async function GET(req: Request, { params }) {
  try {
    const articleContent = await prisma.articleContent.findFirst({
      where: {
        id: params.articleContentId,
      },
      include: {
        title: true,
        content: true,
        callToAction: true,
        hero: true,
        type: true,
      },
    });

    const article = await prisma.article.findFirst({
      where: {
        id: articleContent.articleId,
      },
      include: {
        author: true,
      },
    });

    const content: ArticleContentExpanded = {
      ...articleContent,
      author: article?.author.name,
      publishedDate: dayjs(article?.dateTime).toISOString(),
      affiliateLink: article?.callToActionUrl,
    };

    if (!content) {
      return NextResponse.json({ data: null, message: "Article content could not be fetched.", status: "error" });
    }

    return NextResponse.json({ data: content, message: `Article content fetched successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article content Creation Error", e);
    return NextResponse.json({ data: null, message: "Article content could not be fetched.", status: "error" });
  }
}
export async function PUT(req: Request, { params }) {
  // const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json({ message: "You are not logged in.", status: "error" });
  // }

  try {
    const data: ArticleContentFields = await req.json();

    const articleContent = await prisma.articleContent.findFirst({
      where: {
        id: params.articleContentId,
      },
      include: {
        title: true,
        content: true,
        callToAction: true,
        hero: true,
        type: true,
      },
    });

    if (data.title) {
      let title = { ...articleContent.title, title: data.title };
      if (title.id) {
        title = await prisma.title.update({
          where: {
            id: title.id,
          },
          data: title,
        });
      } else {
        title = await prisma.title.create({
          data: title,
        });
      }
      articleContent.titleId = title.id;
    }

    if (data.type) {
      let type = { ...articleContent.type, type: data.type };
      if (type.id) {
        type = await prisma.articleType.update({
          where: {
            id: type.id,
          },
          data: type,
        });
      } else {
        type = await prisma.articleType.create({
          data: type,
        });
      }
      articleContent.articleTypeId = type.id;
    }

    if (data.hero) {
      let hero = { ...articleContent.hero, url: data.hero };
      if (hero.id) {
        hero = await prisma.hero.update({
          where: {
            id: hero.id,
          },
          data: hero,
        });
      } else {
        hero = await prisma.hero.create({
          data: hero,
        });
      }
      articleContent.heroId = hero.id;
    }

    if (data.callToAction) {
      let callToAction = { ...articleContent.callToAction, text: data.callToAction };
      if (callToAction.id) {
        callToAction = await prisma.callToAction.update({
          where: {
            id: callToAction.id,
          },
          data: callToAction,
        });
      } else {
        callToAction = await prisma.callToAction.create({
          data: callToAction,
        });
      }
      articleContent.callToActionId = callToAction.id;
    }

    if (data.content) {
      let content = { ...articleContent.content, content: data.content };
      if (content.id) {
        content = await prisma.content.update({
          where: {
            id: content.id,
          },
          data: content,
        });
      } else {
        content = await prisma.content.create({
          data: content,
        });
      }
      articleContent.contentId = content.id;
    }

    const { title, content, hero, callToAction, type, ...toUpdate } = articleContent;

    const updatedArticleContent = await prisma.articleContent.update({
      where: {
        id: params.articleContentId,
      },
      data: toUpdate,
      include: {
        title: true,
        content: true,
        callToAction: true,
        hero: true,
        type: true,
      },
    });

    if (!updatedArticleContent) {
      return NextResponse.json({ data: null, message: "Article content could not be created.", status: "error" });
    }

    return NextResponse.json({
      data: updatedArticleContent,
      message: `Article content created successfully.`,
      status: "ok",
    });
  } catch (e) {
    console.error("Article content Creation Error", e);
    return NextResponse.json({ data: null, message: "Article content could not be created.", status: "error" });
  }
}

export async function DELETE(req: Request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  try {
    await prisma.articleContent.delete({
      where: {
        id: params.articleContentId,
      },
    });

    return NextResponse.json({ message: `Article content deleted successfully.`, status: "ok" });
  } catch (e) {
    console.error("Article content Deleted Error", e);
    return NextResponse.json({ data: null, message: "Article content could not be deleted.", status: "error" });
  }
}
