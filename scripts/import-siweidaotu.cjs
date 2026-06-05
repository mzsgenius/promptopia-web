const { Pool } = require("pg");
const fs = require("fs");
(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
  const c = fs.readFileSync("/tmp/art-siweidaotu.md", "utf-8");
  await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
  ['ai-siweidaotu','用AI做思维导图 从笔记到方案完整流程','AI效率','["通义千问","XMind","DeepSeek","思维导图"]','["通义千问","XMind","DeepSeek"]','用通义千问和XMind做思维导图的完整指南。',c,'["AI思维导图","AI做笔记"]',uid,'效率提升','效率',888,77,55]);
  console.log("OK");
  await p.end();
})();
