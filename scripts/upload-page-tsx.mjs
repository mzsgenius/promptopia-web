// upload-page-tsx.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "utf-8");

c.on("ready", () => {
  console.log(`Uploading page.tsx (${content.length} bytes)...`);
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/page.tsx");
    ws.end(content);
    ws.on("close", () => {
      console.log("✅ Uploaded");
      sftp.end();
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'mv /tmp/page.tsx "/root/promptopia-web/src/app/case/[slug]/page.tsx" && cd /root/promptopia-web && npm run build 2>&1 | tail -5 && pm2 restart promptopia && echo BUILD_OK'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.stderr.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2.slice(-400)); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
