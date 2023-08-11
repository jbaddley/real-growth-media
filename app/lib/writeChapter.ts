import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import { env } from "process";
import fs from "fs";
import dayjs from "dayjs";

const model = "gpt-4-0613";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getContext = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("bookContext_1.txt", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
const writeChapter = (chapterNumber: number, chapter: string) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`Chapter_${chapterNumber}")}.txt`, chapter, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(chapter);
      }
    });
  });
};

async function run() {
  const context = await getContext();
  const splitContext: ChatCompletionRequestMessage[] = String(context)
    .split("\n")
    .map((c, i) => {
      return {
        role: "system",
        content: `Transcript chunk number ${i} for context: ${c}`,
      };
    });
  const { data } = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Write an introductory chapter in a casual style to be given to a ghostwriting company for context for a book called: "Business Mindset Unleased: From Frustrated to Fired to Financially Free".`,
      },
      ,
    ],
  });

  console.log(JSON.stringify(data, null, 2));
  const chapter = data.choices[0].message.content;

  const answers = await writeChapter(1, JSON.stringify(chapter, null, 2));
}

run();
