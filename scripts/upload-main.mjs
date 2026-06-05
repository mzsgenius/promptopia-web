import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const articles = [
  { slug: "deepseek-rumen-zhinan", title: "DeepSeek从入门到精通 完整使用指南", file: "01-deepseek.md" },
  { slug: "ai-zuo-ppt", title: "用AI做PPT 从大纲到成品完整流程", file: "02-ai-ppt.md" },
  { slug: "ai-jianli-mianshi", title: "用AI写简历+模拟面试 求职全攻略", file: "03-ai-jianli.md" },
  { slug: "ai-hengping", title: "DeepSeek vs 通义千问 vs Kimi 国产AI横评", file: "04-ai-hengping.md" },
];

c.on("ready", () => {
  console.log("✅ SSH");
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    let done = 0;
    for (const a of articles) {
      const content = readFileSync(`promptopia-web/scripts/articles/${a.file}`, "utf-8");
      const ws = sftp.createWriteStream(`/tmp/articles/${a.slug}.md`);
      ws.end(content);
      ws.on("close", () => {
        done++;
        console.log(`  ${a.slug}.md uploaded`);
        if (done === articles.length) {
          console.log("All uploaded, importing...");
          sftp.end();
          
          const importScript = `const { Pool } = require("pg");
const fs = require("fs");
(async () => {
  const p = new Pool({ connectionString: "postgresql://postgres:postgres@localhost:5432/promptopia" });
  const uid = (await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;
${articles.map(a => {
  const tags = a.slug === "deepseek-rumen-zhinan" ? '["DeepSeek","AI工具","提示词"]' : 
               a.slug === "ai-zuo-ppt" ? '["通义千问","AI","PPT","Gamma"]' :
               a.slug === "ai-jianli-mianshi" ? '["通义千问","DeepSeek","简历","面试"]' :
               '["DeepSeek","通义千问","Kimi","对比"]';
  const tools = a.slug === "deepseek-rumen-zhinan" ? '["DeepSeek"]' :
                a.slug === "ai-zuo-ppt" ? '["通义千问","Gamma"]' :
                a.slug === "ai-jianli-mianshi" ? '["通义千问","DeepSeek"]' :
                '["DeepSeek","通义千问","Kimi"]';
  const cat = a.slug === "ai-hengping" ? "AI学习" : (a.slug === "ai-zuo-ppt" ? "AI效率" : "AI学习");
  const intent = "学习";
  const rt = "技能";
  return `  try {
    const c = fs.readFileSync("/tmp/articles/${a.slug}.md", "utf-8");
    await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',
    ['${a.slug}','${a.title}', '${cat}', ${tags}, ${tools}, '${a.title}完整指南', c, '["AI教程"]', uid, '${intent}','${rt}',888,77,55]);
    console.log("OK: ${a.slug}");
  } catch(e) { console.log("ERR: ${a.slug} " + e.message); }`;
}).join("\n")}
  console.log("ALL DONE");
  await p.end();
})();`;
          
          const b64 = Buffer.from(importScript).toString("base64");
          c.exec(`echo ${b64} | base64 -d > /tmp/import4.cjs && echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import4.cjs`, (e, s) => {
            let o = "";
            s.on("data", (d) => o += d.toString());
            s.on("close", () => { console.log(o); c.end(); });
          });
        }
      });
    }
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
