const { Pool } = require("pg");
const fs = require("fs");

(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
  const content = fs.readFileSync("/tmp/article-2.md", "utf-8");
  await p.query(
    'INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    ["tongyi-xiaohongshu-5000","用通义千问+稿定设计做小红书博主 从0涨粉5000的90天记录","AI副业",'["通义千问","稿定设计","小红书","副业","博主"]','["通义千问","稿定设计"]','用通义千问写文案和稿定设计做封面，90天从0到5000粉的小红书运营记录。含完整提示词、发布节奏、数据表。',content,'["小红书副业","通义千问副业","AI做小红书"]',uid,"副业","收入",888,77,55]
  );
  console.log("OK 第2篇已上线");
  await p.end();
})();
