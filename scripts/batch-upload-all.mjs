import { Client } from "ssh2";
import { readFileSync, readdirSync } from "fs";

const c = new Client();
const dir = "promptopia-web/scripts/articles";
const files = readdirSync(dir).filter(f => f.endsWith(".md"));
console.log(`Found ${files.length} article files`);

const articles = [
  { slug: "deepseek-rumen-zhinan", title: "DeepSeek从入门到精通 完整使用指南", cat: "AI学习", tags: ["DeepSeek","AI工具","提示词"], tools: ["DeepSeek"], kw: ["DeepSeek教程","国产AI"], intent: "学习", rt: "技能" },
  { slug: "ai-zuo-ppt", title: "用AI做PPT 从大纲到成品30分钟完整流程", cat: "AI效率", tags: ["通义千问","AI","PPT","Gamma"], tools: ["通义千问","Gamma"], kw: ["AI做PPT","PPT自动生成"], intent: "效率提升", rt: "效率" },
  { slug: "ai-jianli-mianshi", title: "用AI写简历+模拟面试 求职全攻略", cat: "AI学习", tags: ["通义千问","DeepSeek","简历","面试"], tools: ["通义千问","DeepSeek"], kw: ["AI写简历","AI模拟面试"], intent: "学习", rt: "技能" },
  { slug: "ai-hengping", title: "DeepSeek vs 通义千问 vs Kimi 国产AI横评", cat: "AI学习", tags: ["DeepSeek","通义千问","Kimi","对比"], tools: ["DeepSeek","通义千问","Kimi"], kw: ["国产AI对比","AI工具横评"], intent: "学习", rt: "技能" },
  { slug: "ai-siweidaotu", title: "用AI做思维导图 笔记到方案完整流程", cat: "AI效率", tags: ["AI","思维导图","通义千问"], tools: ["通义千问","XMind"], kw: ["AI思维导图","AI做笔记"], intent: "效率提升", rt: "效率" },
  { slug: "ai-xiezhen-xiutu", title: "用国产AI做写真+修图 从生成到精修", cat: "AI副业", tags: ["可灵AI","即梦","AI写真"], tools: ["可灵AI","即梦"], kw: ["AI写真","AI修图"], intent: "副业", rt: "收入" },
  { slug: "ai-xie-xiaoshuo", title: "用AI写小说 从世界观到完整章节", cat: "AI副业", tags: ["DeepSeek","通义千问","写作","小说"], tools: ["DeepSeek","通义千问"], kw: ["AI写小说","AI创作"], intent: "副业", rt: "收入" },
  { slug: "ai-dianshang-zhutu", title: "用AI做电商主图 商品图生成全流程", cat: "AI副业", tags: ["通义万相","可灵AI","电商"], tools: ["通义万相","可灵AI"], kw: ["AI电商主图","AI商品图"], intent: "副业", rt: "收入" },
  { slug: "ai-zhengli-huiyi", title: "用AI自动整理会议录音 通义听悟实操", cat: "AI效率", tags: ["通义听悟","通义千问","会议"], tools: ["通义听悟","通义千问"], kw: ["AI会议纪要","自动整理录音"], intent: "效率提升", rt: "效率" },
  { slug: "ai-qiming", title: "用AI起名取名 从人名到品牌名完整指南", cat: "AI效率", tags: ["通义千问","DeepSeek","起名"], tools: ["通义千问","DeepSeek"], kw: ["AI起名","AI取名"], intent: "效率提升", rt: "效率" },
  { slug: "ai-xue-yingyu", title: "用AI学英语 翻译到口语练习完整方案", cat: "AI学习", tags: ["通义千问","DeepSeek","英语"], tools: ["通义千问","DeepSeek"], kw: ["AI学英语","AI翻译"], intent: "学习", rt: "技能" },
  { slug: "ai-shuju-fenxi", title: "用AI做数据分析 Excel到可视化报告", cat: "AI效率", tags: ["通义千问","DeepSeek","数据分析"], tools: ["通义千问","DeepSeek"], kw: ["AI数据分析","AI做报表"], intent: "效率提升", rt: "效率" },
  { slug: "ai-hetong", title: "用AI写合同审合同 法律文书自动化", cat: "AI效率", tags: ["通义千问","DeepSeek","合同","法律"], tools: ["通义千问","DeepSeek"], kw: ["AI写合同","AI审合同"], intent: "效率提升", rt: "效率" },
  { slug: "ai-lvyou-gonglve", title: "用AI做旅游攻略 行程规划全流程", cat: "AI效率", tags: ["通义千问","DeepSeek","旅游"], tools: ["通义千问","DeepSeek"], kw: ["AI旅游攻略","AI做攻略"], intent: "效率提升", rt: "效率" },
  { slug: "ai-dushu-biji", title: "用AI做读书笔记 知识管理完整方法", cat: "AI学习", tags: ["通义千问","Kimi","读书","笔记"], tools: ["通义千问","Kimi"], kw: ["AI读书笔记","AI速读"], intent: "学习", rt: "技能" },
  { slug: "ai-fengmian-sheji", title: "用AI批量做封面 小红书封面全自动", cat: "AI副业", tags: ["通义千问","稿定设计","小红书"], tools: ["通义千问","稿定设计"], kw: ["AI小红书封面","AI做封面"], intent: "副业", rt: "收入" },
  { slug: "ai-gongzuo-zongjie", title: "用AI写周报月报年终总结 全场景", cat: "AI效率", tags: ["通义千问","DeepSeek","周报","总结"], tools: ["通义千问","DeepSeek"], kw: ["AI写周报","AI年终总结"], intent: "效率提升", rt: "效率" },
];

// Create combined import script
let importScript = `const { Pool } = require("pg");
const fs = require("fs");
(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
`;

for (const a of articles) {
  importScript += `  try {
    const c${a.slug.replace(/-/g,'_')} = fs.readFileSync("/tmp/articles/${a.slug}.md", "utf-8");
    await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    ['${a.slug}','${a.title}','${a.cat}','${JSON.stringify(a.tags)}','${JSON.stringify(a.tools)}','${a.title}完整指南',c${a.slug.replace(/-/g,'_')},'${JSON.stringify(a.kw)}',uid,'${a.intent}','${a.rt}',888,77,55]);
    console.log("OK: ${a.slug}");
  } catch(e) { console.log("SKIP: ${a.slug} " + e.message); }\n`;
}

importScript += `  console.log("ALL DONE");
  await p.end();
})();`;

// Write import script
const fs2 = await import("fs");
fs2.writeFileSync("/tmp/batch-import-all.cjs", importScript);
console.log("Import script written:", importScript.length, "bytes");

// Now upload via SFTP
c.on("ready", async () => {
  console.log("✅ SSH, uploading articles...");
  
  c.sftp((err, sftp) => {
    if (err) { console.error("SFTP err:", err.message); c.end(); return; }
    
    sftp.mkdir("/tmp/articles", (err) => {
      let uploaded = 0;
      const total = files.length;
      
      for (const f of files) {
        const content = readFileSync(`${dir}/${f}`, "utf-8");
        const ws = sftp.createWriteStream(`/tmp/articles/${f}`);
        ws.end(content);
        ws.on("close", () => {
          uploaded++;
          process.stdout.write(`\r  Uploading: ${uploaded}/${total}`);
          if (uploaded === total) {
            console.log("\n✅ All files uploaded, importing...");
            sftp.end();
            
            // Upload import script
            const importContent = readFileSync("/tmp/batch-import-all.cjs", "utf-8");
            c.sftp((err2, sftp2) => {
              const ws2 = sftp2.createWriteStream("/tmp/batch-import-all.cjs");
              ws2.end(importContent);
              ws2.on("close", () => {
                sftp2.end();
                c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/batch-import-all.cjs`, (e3, s3) => {
                  let o3 = "";
                  s3.on("data", (d) => o3 += d.toString());
                  s3.on("close", () => { console.log(o3); c.end(); });
                });
              });
            });
          }
        });
      }
    });
  });
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
