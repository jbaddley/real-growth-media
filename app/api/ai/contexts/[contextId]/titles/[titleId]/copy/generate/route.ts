import { NextResponse } from "next/server";
import { getAdCopy, getPromptFromContext } from "../../../../../../../../lib/writeAds";
import { auth, currentUser } from "@clerk/nextjs";
import { AdCopy, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params: { contextId, titleId } }) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }
  const user = await currentUser();

  const context = await prisma.context.findFirst({
    where: {
      id: contextId,
    },
  });
  const title = await prisma.adTitle.findFirst({
    where: {
      id: titleId,
    },
  });
  const data = await getAdCopy(
    getPromptFromContext(context, brand, model),
    `${title.preHeadline} ${title.headline} ${title.subHeadline}`
  );
  const adCopy = await prisma.adCopy.createMany({
    data: data.map(
      (d) =>
        ({
          content: d,
          email: user.emailAddresses[0].emailAddress,
          adTitleId: title.id,
          contextId,
        } as AdCopy)
    ),
  });
  return NextResponse.json({
    data: adCopy,
    status: "error",
  });
}
