import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import { BrandPrompt, PrismaClient } from "@prisma/client";
import { getBrandIdeas } from "../../../../../../lib/writeAds";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const { prompt, promptId } = await req.json();

  console.log({
    prompt,
    contextId,
  });

  const user = await currentUser();

  const context = await prisma.context.findFirst({
    where: {
      id: contextId,
    },
  });

  let brandPrompt: BrandPrompt;

  if (prompt) {
    brandPrompt = await prisma.brandPrompt.findFirst({
      where: {
        prompt,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (!brandPrompt) {
      brandPrompt = await prisma.brandPrompt.create({
        data: {
          prompt,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }
  } else if (promptId) {
    brandPrompt = await prisma.brandPrompt.findFirst({
      where: {
        id: promptId,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  const brandIdeas = await getBrandIdeas(context, brandPrompt.prompt || prompt, 5);
  console.log({ brandIdeas });
  await prisma.brandIdea.createMany({
    data: brandIdeas.map((b) => ({
      content: b,
      contextId,
      brandPromptId: brandPrompt.id,
      email: user.emailAddresses[0].emailAddress,
    })),
  });

  const data = await prisma.brandIdea.findMany({
    where: {
      contextId: contextId,
      brandPromptId: brandPrompt.id || promptId,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
export async function DELETE(req: Request, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const data = await prisma.context.delete({
    where: {
      id: contextId,
    },
  });

  return NextResponse.json({
    data,
    status: "error",
  });
}
export async function PUT(req: Request, { params: { contextId } }: { params: { contextId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ message: "You are not logged in.", status: "error" });
  }

  const user = await currentUser();
  const body = await req.json();

  const data = await prisma.context.update({
    where: {
      id: contextId,
    },
    data: {
      data: body.data,
      name: body.name,
      email: user.emailAddresses[0].emailAddress,
      options: body.options,
    },
  });

  return NextResponse.json({
    data,
    status: "success",
  });
}
