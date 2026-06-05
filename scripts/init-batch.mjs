import { Client } from "ssh2";
import { readFileSync, writeFileSync } from "fs";

const articles = [
  { slug: "deepseek-ru men-zhinan", title: "DeepSeek从入门到精通 完整使用指南", cat: "AI学习", tags: ["DeepSeek","AI工具","提示词"], tools: ["DeepSeek"], kw: ["DeepSeek教程","DeepSeek使用技巧"], intent: "学习", rt: "技能" },
];

const importScript = `const { Pool } = require("pg");
const fs = require("fs");
const articles = ${JSON.stringify(articles, null, 2)};
(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
  for (const a of articles) {
    const content = fs.readFileSync("/tmp/articles/" + a.slug + ".md", "utf-8");
    await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    [a.slug, a.title, a.cat, JSON.stringify(a.tags), JSON.stringify(a.tools), "完整指南", content, JSON.stringify(a.kw), uid, a.intent, a.rt, 888, 77, 55]);
    console.log("OK: " + a.slug);
  }
  console.log("ALL DONE");
  await p.end();
})();`;

writeFileSync("/tmp/batch-import.cjs", importScript);
console.log("Import script written");
console.log("Articles to create:", articles.length);
