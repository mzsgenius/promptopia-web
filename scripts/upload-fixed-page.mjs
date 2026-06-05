// upload-fixed-page.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "utf-8");

c.on("ready", () => {
  console.log(`Uploading ${content.length} bytes...`);
  c.sftp((err, sftp) => {
    if (err) { console.error("SFTP:", err.message); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/pg2.tsx");
    let ok = false;
    ws.on("close", () => {
      if (!ok) return;
      console.log("✅ Written to /tmp, copying...");
      sftp.end();
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cp /tmp/pg2.tsx "/root/promptopia-web/src/app/case/[slug]/page.tsx" && echo COPIED'`, (e2, s2) => {
        let o2 = "";
        s2.on("close", () => {
          if (o2.includes("COPIED")) {
            console.log("Building...");
            c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => { console.log(o3.slice(-200)); c.end(); });
            });
          } else { console.log("Copy failed"); c.end(); }
        });
        s2.on("data", (d) => o2 += d.toString());
      });
    });
    ws.on("error", (e) => { console.error("Write error:", e.message); });
    ws.write(content, () => { ok = true; });
    ws.end();
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
