const { Pool } = require("pg");
const fs = require("fs");

(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
  const content = fs.readFileSync("/tmp/article-1.md", "utf-8");
  await p.query(
    'INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    ["doubao-xianyu-2500","用豆包+通义千问做闲鱼副业 月入2500完整记录","AI副业",'["豆包","通义千问","闲鱼","副业"]','["豆包","通义千问"]',"用豆包和通义千问在闲鱼卖PPT模板的60天完整记录。含完整提示词、每日SOP、数据表。",content,'["闲鱼副业","豆包副业"]',uid,"副业","收入",999,88,66]
  );
  console.log("OK");
  await p.end();
})();
