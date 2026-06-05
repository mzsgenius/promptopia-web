// upload-full-v2.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/scripts/article-2.md", "utf-8");

c.on("ready", () => {
  console.log(`Uploading full version (${content.length} bytes)...`);
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/article-2.md");
    ws.end(content);
    ws.on("close", () => {
      console.log("✅ Uploaded, reimporting...");
      sftp.end();
      // Delete old + reimport
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '
psql "postgresql://postgres:postgres@localhost:5432/promptopia" -c "DELETE FROM \\\"Case\\\" WHERE slug='"'tongyi-xiaohongshu-5000'"'"
NODE_PATH=/root/promptopia-web/node_modules node /tmp/import2.cjs
'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
