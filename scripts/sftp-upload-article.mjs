// sftp-upload-article.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";

const c = new Client();
const content = readFileSync("promptopia-web/scripts/article-1.md", "utf-8");

c.on("ready", () => {
  console.log(`Uploading ${content.length} bytes...`);
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/article-1.md");
    ws.end(content);
    ws.on("close", () => {
      console.log("✅ Article uploaded");
      sftp.end();
      
      // Re-import
      c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import.cjs`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log("Import:", o); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
