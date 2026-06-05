import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const articles = [
  { slug: "deepseek-rumen-zhinan", title: "DeepSeek从入门到精通 完整使用指南", file: "01-deepseek.md", cat: "AI学习", tags: ["DeepSeek","AI工具","提示词"], tools: ["DeepSeek"], kw: ["DeepSeek教程","国产AI"], intent: "学习", rt: "技能" },
  { slug: "ai-zuo-ppt", title: "用AI做PPT 从大纲到成品完整流程", file: "02-ai-ppt.md", cat: "AI效率", tags: ["通义千问","AI","PPT","Gamma"], tools: ["通义千问","Gamma"], kw: ["AI做PPT","AI效率"], intent: "效率提升", rt: "效率" },
  { slug: "ai-jianli-mianshi", title: "用AI写简历+模拟面试 求职全攻略", file: "03-ai-jianli.md", cat: "AI学习", tags: ["通义千问","DeepSeek","简历","面试"], tools: ["通义千问","DeepSeek"], kw: ["AI写简历","AI模拟面试"], intent: "学习", rt: "技能" },
  { slug: "ai-hengping", title: "DeepSeek vs 通义千问 vs Kimi 国产AI横评", file: "04-ai-hengping.md", cat: "AI学习", tags: ["DeepSeek","通义千问","Kimi","对比"], tools: ["DeepSeek","通义千问","Kimi"], kw: ["国产AI对比","AI工具横评"], intent: "学习", rt: "技能" },
];

c.on("ready", () => {
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    let done = 0;
    for (const a of articles) {
      const content = readFileSync(`promptopia-web/scripts/articles/${a.file}`, "utf-8");
      const ws = sftp.createWriteStream(`/tmp/articles/${a.slug}.md`);
      ws.end(content);
      ws.on("close", () => {
        done++;
        if (done === articles.length) {
          sftp.end();
          // Write a node script to /tmp then execute
          let js = `const { Pool } = require("pg");\nconst fs = require("fs");\n(async()=>{\nconst p=new Pool({connectionString:"postgresql://postgres:postgres@localhost:5432/promptopia"});\nconst uid=(await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;\n`;
          for (const a2 of articles) {
            const tags = JSON.stringify(a2.tags);
            const tools = JSON.stringify(a2.tools);
            const kw = JSON.stringify(a2.kw);
            js += `try{const c=fs.readFileSync("/tmp/articles/${a2.slug}.md","utf-8");await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',['${a2.slug}','${a2.title}','${a2.cat}','${tags}','${tools}','${a2.title}完整指南',c,'${kw}',uid,'${a2.intent}','${a2.rt}',888,77,66]);console.log("OK:${a2.slug}");}catch(e){console.log("ERR:${a2.slug}:"+e.message);}\n`;
          }
          js += `console.log("ALL DONE");await p.end();})();`;
          
          const b64 = Buffer.from(js).toString("base64");
          c.exec(`echo ${b64} | base64 -d > /tmp/import4b.cjs && echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import4b.cjs`, (e, s) => {
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
