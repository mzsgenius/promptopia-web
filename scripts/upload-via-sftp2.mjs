// upload-via-sftp2.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "utf-8");

c.on("ready", () => {
  console.log(`Uploading ${content.length} bytes via SFTP...`);
  c.sftp((err, sftp) => {
    if (err) { console.error("SFTP error:", err.message); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/pg.tsx");
    let wroteOk = false;
    ws.on("close", () => {
      if (!wroteOk) return;
      console.log("✅ /tmp/pg.tsx written, copying to target...");
      sftp.end();
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cp /tmp/pg.tsx "/root/promptopia-web/src/app/case/[slug]/page.tsx" && echo COPY_OK'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => {
          if (o2.includes("COPY_OK")) {
            console.log("✅ Copied, building...");
            c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -5 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => { console.log(o3.slice(-300)); c.end(); });
            });
          } else {
            console.log("Copy failed:", o2);
            c.end();
          }
        });
      });
    });
    ws.on("error", (e) => { console.error("Write error:", e.message); wroteOk = false; });
    ws.write(content, () => { wroteOk = true; });
    ws.end();
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
