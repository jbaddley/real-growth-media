import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import { env } from "process";
import { AdCopy, AdTitle, Context, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export function getPromptFromContext(context: Context, brand?: string, model?: string) {
  return `
    Industry: ${context.options["industry"] || "any"}
    Marekting Tone: ${context.options["tone"] || "formal"}
    Target Marketing Audience: ${context.options["audience"] || "any"}
    About Us: ${context.data}
  `;
}

export async function getAdCopy(context: string, title: string, num: number = 5) {
  const { data } = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: `Use the following as context: ${context}` },
      {
        role: "system",
        content: `Based on this advertisement title: ${title}, create ${num} different angles for copy for inside the advertisement to help us attract new clients based on our ideal client demographic.`,
      },
    ],
  });
  const answers = data.choices[0].message.content
    .split("\n")
    .map((a) =>
      a
        .replaceAll('"', "")
        .replaceAll("\n", "")
        .replace(/^\d+\. /, "")
        .trim()
    )
    .filter((a) => !!a);
  return answers;
}

export async function writeTitles(context: string, num: number = 5) {
  const { data } = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: `Use the following as context: ${context}` },
      {
        role: "system",
        content: `Create list of ${num} catchy advertising titles for our company to attract new clients.`,
      },
    ],
  });

  const titles = data.choices[0].message.content
    .split("\n")
    .map((a) =>
      a
        .replaceAll('"', "")
        .replaceAll("\n", "")
        .replace(/^\d+\. /, "")
        .trim()
    )
    .filter((a) => !!a)
    .map((t, i) => ({ id: i, title: t, copy: [] }));

  return titles;
}

export async function writeAdvancedTitles(
  context: string,
  brand: string,
  model: string,
  num: number = 5
): Promise<Partial<AdTitle>[]> {
  const additionalInfo = [];
  if (brand) {
    additionalInfo.push({
      role: "system",
      content: `Use the brand name ${brand} to evoke curiosity`,
    });
  }
  if (model) {
    additionalInfo.push({
      role: "system",
      content: `Use the advertising model ${model} as the base strategy`,
    });
  }
  const { data } = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: `Use the following as context: ${context}` },
      {
        role: "system",
        content: `Output the result as a JSON array of objects. Each object should include the fields: preHeadline, headling and, subHeadline.`,
      },
      ...additionalInfo,
      {
        role: "system",
        content: `Create list of ${num} catchy advertising titles for our company to attract new clients. The preHeadline should call out our target market. The headline should invite curiosity through our brand: ${brand}. The subHeadline should address possible challenges, misconceptions or problems the potential lead might have. `,
      },
    ],
  });

  const titles = JSON.parse(data.choices[0].message.content);
  return titles;
}

export async function generateTitles(contextId: string, email: string, brand: string, model: string, num: number) {
  const context = await prisma.context.findFirst({
    where: {
      id: contextId,
    },
  });

  const data = await writeAdvancedTitles(getPromptFromContext(context), brand, model, num);
  console.log({ brand, model });
  const adTitles = await prisma.adTitle.createMany({
    data: data.map(
      (d) =>
        ({
          email,
          ...d,
          contextId,
        } as AdTitle)
    ),
  });
  return adTitles;
}

export async function generateCopyIdeas(
  contextId: string,
  email: string,
  titleId: string,
  brand: string,
  model: string,
  num: number
) {
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
    `${title.preHeadline} ${title.headline} ${title.subHeadline}`,
    num
  );
  const adTitles = await prisma.adCopy.createMany({
    data: data.map(
      (d) =>
        ({
          email,
          content: d,
          adTitleId: titleId,
          contextId,
        } as AdCopy)
    ),
  });
  return adTitles;
}
