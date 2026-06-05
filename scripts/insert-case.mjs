// insert-case.mjs
import { Client } from "ssh2";
import { readFileSync, writeFileSync } from "fs";

const script = [
  'const { PrismaClient } = require("/root/promptopia-web/src/generated/prisma/client.js");',
  'const { PrismaPg } = require("/root/promptopia-web/node_modules/@prisma/adapter-pg");',
  'const fs = require("fs");',
  "async function main() {",
  "  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });",
  "  const user = await p.user.findFirst();",
  '  if (!user) { console.log("No user"); return; }',
  '  const content = fs.readFileSync("/tmp/about-case.md", "utf-8");',
  "  const c = await p.case.create({",
  '    data: {',
  '      slug: "promptopia-gongneng-jieshao-markdown-ceshi",',
  '      title: "PrompTopia 完整功能介绍与Markdown样式测试页",',
  '      category: "AI效率",',
  '      tags: ["AI", "PrompTopia", "社区", "Markdown"],',
  '      tools: ["ChatGPT", "Cursor", "Claude"],',
  '      summary: "PrompTopia中文AI实战案例社区的完整功能介绍。包含浏览、发布、搜索、SEO等功能说明及Markdown格式展示。",',
  '      content: content,',
  '      seoKeywords: ["AI案例社区", "PrompTopia", "Markdown测试"],',
  '      intent: "学习", resultType: "技能",',
  '      authorId: user.id,',
  '      viewCount: 999, likeCount: 88, bookmarkCount: 66,',
  '      publishedAt: new Date(),',
  "    },",
  "  });",
  '  console.log("OK: " + c.slug);',
  "  await p.$disconnect();",
  "}",
  'main().catch(function(e) { console.log("ERR: " + e.message); });',
].join("\n");

const content = readFileSync("promptopia-web/scripts/about-case.md", "utf-8");
writeFileSync("/tmp/insert-case.cjs", script);
writeFileSync("/tmp/about-case.md", content);

const cc = new Client();
let uploaded = 0;

function uploadNext() {
  const file = uploaded === 0 ? ["insert-case.cjs", script] : ["about-case.md", content];
  const name = file[0];
  const data = file[1];
  const b64 = Buffer.from(data).toString("base64");

  cc.exec(`base64 -d > /tmp/${name}`, (e, stream) => {
    if (e || !stream) { console.log(`Upload ${name}: ERR`); return; }
    stream.on("close", () => {
      console.log(`Upload ${name}: OK`);
      uploaded++;
      if (uploaded < 2) {
        setTimeout(uploadNext, 500);
      } else {
        // Run import
        console.log("Importing...");
        cc.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && node /tmp/insert-case.cjs'`, (e2, s2) => {
          let o = "";
          s2.on("data", (d) => o += d.toString());
          s2.on("close", () => { console.log(o); cc.end(); });
        });
      }
    });
    stream.stdin.end(b64);
  });
}

cc.on("ready", () => {
  console.log("✅ SSH");
  setTimeout(uploadNext, 1000);
});

cc.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
