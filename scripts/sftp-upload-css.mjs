// sftp-upload-css.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/globals.css", "utf-8");

c.on("ready", () => {
  console.log(`Uploading globals.css (${content.length} bytes)...`);
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/globals.css");
    ws.end(content);
    ws.on("close", () => {
      console.log("✅ Uploaded, moving...");
      sftp.end();
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'mv /tmp/globals.css /root/promptopia-web/src/app/globals.css && cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
