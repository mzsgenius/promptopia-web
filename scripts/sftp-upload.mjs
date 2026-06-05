// sftp-upload.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";

const files = [
  { local: "promptopia-web/scripts/article-1.md", remote: "/tmp/article-1.md", slug: "doubao-xianyu-2500", title: "用豆包+通义千问做闲鱼副业 月入2500完整记录" },
];

const c = new Client();

c.on("ready", () => {
  console.log("✅ SSH, starting SFTP...");
  c.sftp((err, sftp) => {
    if (err) { console.error("SFTP error:", err.message); c.end(); return; }
    
    let done = 0;
    for (const f of files) {
      const content = readFileSync(f.local, "utf-8");
      const ws = sftp.createWriteStream(f.remote);
      ws.end(content);
      ws.on("close", () => {
        console.log(`✅ ${f.remote} uploaded (${content.length} bytes)`);
        done++;
        if (done === files.length) {
          sftp.end();
          // Now import via node
          const importCmd = `sudo NODE_PATH=/root/promptopia-web/node_modules node -e "const{Pool}=require('pg');const fs=require('fs');(async()=>{const p=new Pool({connectionString:'postgresql://postgres:postgres@localhost:5432/promptopia'});const uid=(await p.query('SELECT id FROM \\\"User\\\" LIMIT 1')).rows[0].id;const c=fs.readFileSync('/tmp/article-1.md','utf-8');await p.query('INSERT INTO \\\"Case\\\"(id,slug,title,category,tags,tools,summary,content,\\\"seoKeywords\\\",\\\"authorId\\\",intent,\\\"resultType\\\",\\\"viewCount\\\",\\\"likeCount\\\",\\\"bookmarkCount\\\",\\\"publishedAt\\\",\\\"createdAt\\\",\\\"updatedAt\\\") VALUES(substr(md5(random()::text),1,25),\\$1,\\$2,\\$3,\\$4::jsonb,\\$5::jsonb,\\$6,\\$7,\\$8::jsonb,\\$9,\\$10,\\$11,\\$12,\\$13,\\$14,NOW(),NOW(),NOW()) ON CONFLICT(slug) DO NOTHING',['doubao-xianyu-2500','用豆包+通义千问做闲鱼副业 月入2500完整记录','AI副业','[\\\"豆包\\\",\\\"通义千问\\\",\\\"闲鱼\\\",\\\"副业\\\"]','[\\\"豆包\\\",\\\"通义千问\\\"]','用豆包和通义千问在闲鱼卖PPT模板的60天完整记录。',c,'[\\\"闲鱼副业\\\",\\\"豆包副业\\\"]',uid,'副业','收入',999,88,66]);console.log('OK 已上线!');p.end()})();"`;
          c.exec(`echo Mmzzss060112 | sudo -S bash -c '${importCmd}'`, (e2, s2) => {
            let o2 = "";
            s2.on("data", (d) => o2 += d.toString());
            s2.stderr.on("data", (d) => o2 += d.toString());
            s2.on("close", () => { console.log(o2); c.end(); });
          });
        }
      });
      ws.on("error", (e) => { console.error("Write error:", e.message); });
    }
  });
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
