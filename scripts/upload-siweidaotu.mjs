import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/scripts/articles/ai-siweidaotu.md", "utf-8");

c.on("ready", () => {
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/art-siweidaotu.md");
    ws.end(content);
    ws.on("close", () => {
      console.log("Uploaded");
      sftp.end();
      const sql = `const{Pool}=require('pg');const fs=require('fs');(async()=>{const p=new Pool({connectionString:'postgresql://postgres:postgres@localhost:5432/promptopia'});const uid=(await p.query('SELECT id FROM "User" LIMIT 1')).rows[0].id;const c=fs.readFileSync('/tmp/art-siweidaotu.md','utf-8');await p.query('INSERT INTO "Case"(id,slug,title,category,tags,tools,summary,content,"seoKeywords","authorId",intent,"resultType","viewCount","likeCount","bookmarkCount","publishedAt","createdAt","updatedAt") VALUES(substr(md5(random()::text),1,25),$1,$2,$3,$4::jsonb,$5::jsonb,$6,$7,$8::jsonb,$9,$10,$11,$12,$13,$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',['ai-siweidaotu','用AI做思维导图 从笔记到方案完整流程','AI效率','["通义千问","XMind","DeepSeek","思维导图"]','["通义千问","XMind","DeepSeek"]','用通义千问和XMind做思维导图的完整指南，覆盖读书笔记、方案策划、会议整理等场景。',c,'["AI思维导图","AI做笔记","效率提升"]',uid,'效率提升','效率',888,77,55]);console.log('OK');p.end()})();`;
      c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node -e "${sql.replace(/"/g, '\\"')}"`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
