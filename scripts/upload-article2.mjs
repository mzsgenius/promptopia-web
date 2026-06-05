// upload-article2.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const article = readFileSync("promptopia-web/scripts/article-2.md", "utf-8");
const script = readFileSync("promptopia-web/scripts/import-article2.cjs", "utf-8");

c.on("ready", () => {
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    
    // Upload article
    const ws1 = sftp.createWriteStream("/tmp/article-2.md");
    ws1.end(article);
    ws1.on("close", () => {
      console.log("✅ article-2.md uploaded");
      
      // Upload script
      const ws2 = sftp.createWriteStream("/tmp/import2.cjs");
      ws2.end(script);
      ws2.on("close", () => {
        console.log("✅ import script uploaded");
        sftp.end();
        
        // Execute
        c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import2.cjs`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2); c.end(); });
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
