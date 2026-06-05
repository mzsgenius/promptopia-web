const { Pool } = require("pg");
const fs = require("fs");

(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
  const content = fs.readFileSync("/tmp/article-3.md", "utf-8");
  await p.query(
    'INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    ["ai-duanshipin-chuangzuo-gongzuoliu","用AI做短视频 从脚本到发布全流程 90天320万播放记录","AI工作流",'["通义千问","剪映","可灵AI","稿定设计","短视频","AI创作","工作流"]','["通义千问","剪映","可灵AI","稿定设计"]','用通义千问写脚本、剪映剪辑、稿定设计做封面，单条视频从6小时压缩到60分钟。90天83条视频、320万播放、4.2万粉、收入1.23万。含完整提示词和周级数据。',content,'["AI短视频","AI做视频","短视频工作流","AI创作","剪映教程"]',uid,"副业","收入",999,99,77]
  );
  console.log("OK 第3篇已上线");
  await p.end();
})();
