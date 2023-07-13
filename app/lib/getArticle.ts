import validator from "validator";
import prisma from "./prismadb";

export default function (articleId: string) {
  if (validator.isUUID(articleId)) {
    return prisma.article.findFirst({
      where: {
        id: articleId,
      },
      include: {
        category: true,
        articleContent: true,
      },
    });
  }
  return prisma.article.findFirst({
    where: {
      slug: articleId,
    },
    include: {
      category: true,
      articleContent: true,
    },
  });
}
