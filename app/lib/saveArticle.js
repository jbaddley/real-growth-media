const fs = require("fs");
const minimist = require("minimist");
const parse = require("node-html-parser").parse;

const args = minimist(process.argv.slice(2));

const fsReadFileHtml = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (error, htmlString) => {
      if (!error && htmlString) {
        resolve(htmlString);
      } else {
        reject(error);
      }
    });
  });
};

(async () => {
  const template = await fsReadFileHtml(args.t);
  const root = parse(template);
  const body = root.querySelector("body");
  const category = body.getAttribute("data-category");
  const article = body.getAttribute("data-article");
  const contentId = body.getAttribute("data-content-id");
  const content = body.innerHTML;
  await fetch(`http://localhost:3000/api/category/${category}/article/${article}/article-content/${contentId}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
})();
