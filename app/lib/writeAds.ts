import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import { env } from "process";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

export async function writeTitles(context: string, num: number = 10) {
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

export async function writeTitlesWithCopy(context: string) {
  const titles = await writeTitles(context);

  const copy = await Promise.all(
    titles.map(async ({ title }) => {
      const copy = await getAdCopy(context, title);
      return { title, copy };
    })
  );
  return copy;
}
