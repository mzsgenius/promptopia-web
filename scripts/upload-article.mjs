import { Client } from "ssh2";
import { readFileSync } from "fs";

const article = readFileSync("promptopia-web/scripts/article-1.md", "utf-8");
const b64 = Buffer.from(article).toString("base64");

const c = new Client();
c.on("ready", () => {
  const s = c.exec("base64 -d > /tmp/article-1.md", (e, stream) => {
    if (e || !stream) { console.error("ERR"); c.end(); return; }
    stream.on("close", () => {
      c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node -e "const{Pool}=require('pg');const fs=require('fs');(async()=>{const p=new Pool({connectionString:'postgresql://postgres:postgres@localhost:5432/promptopia'});const uid=(await p.query('SELECT id FROM \\\"User\\\" LIMIT 1')).rows[0].id;const c=fs.readFileSync('/tmp/article-1.md','utf-8');await p.query(\\\"INSERT INTO \\\\\\\"Case\\\\\\\"(id,slug,title,category,tags,tools,summary,content,\\\\\\\"seoKeywords\\\\\\\",\\\\\\\"authorId\\\\\\\",intent,\\\\\\\"resultType\\\\\\\",\\\\\\\"viewCount\\\\\\\",\\\\\\\"likeCount\\\\\\\",\\\\\\\"bookmarkCount\\\\\\\",\\\\\\\"publishedAt\\\\\\\",\\\\\\\"createdAt\\\\\\\",\\\\\\\"updatedAt\\\\\\\") VALUES(substr(md5(random()::text),1,25),'doubao-xianyu-fuye-2500','用豆包+通义千问做闲鱼副业 从0到月入2500的完整记录','AI副业','[\\\\\\\"豆包\\\\\\\",\\\\\\\"通义千问\\\\\\\",\\\\\\\"闲鱼\\\\\\\",\\\\\\\"副业\\\\\\\",\\\\\\\"PPT模板\\\\\\\"]'::jsonb,'[\\\\\\\"豆包\\\\\\\",\\\\\\\"通义千问\\\\\\\"]'::jsonb,'大二学生用豆包和通义千问在闲鱼卖PPT模板的60天记录。含完整提示词和每日SOP。',\\\$1,'[\\\\\\\"闲鱼副业\\\\\\\",\\\\\\\"豆包副业\\\\\\\",\\\\\\\"AI副业赚钱\\\\\\\"]'::jsonb,\\\$2,'副业','收入',999,88,66,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING\\\",[c,uid]);console.log('OK');p.end()})();"`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2); c.end(); });
      });
    });
    stream.stdin.end(b64);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
