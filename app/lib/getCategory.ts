import validator from "validator";
import prisma from "./prismadb";

export default function (categoryId: string) {
  if (validator.isUUID(categoryId)) {
    return prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    });
  }
  return prisma.category.findFirst({
    where: {
      slug: categoryId,
    },
  });
}
