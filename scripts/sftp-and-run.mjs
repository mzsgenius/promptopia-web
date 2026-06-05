// sftp-and-run.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";

const c = new Client();

c.on("ready", () => {
  console.log("✅ SSH/SFTP");
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    
    // Upload import script
    const scriptContent = readFileSync("promptopia-web/scripts/import-article.cjs", "utf-8");
    const ws = sftp.createWriteStream("/tmp/import.cjs");
    ws.end(scriptContent);
    ws.on("close", () => {
      console.log("✅ Script uploaded");
      sftp.end();
      
      // Execute
      c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import.cjs`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.stderr.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(o); c.end(); });
      });
    });
  });
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
