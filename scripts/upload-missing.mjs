// upload-missing.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  ["promptopia-web/src/components/shared/copy-button.tsx", "/tmp/copy-button.tsx", "cp /tmp/copy-button.tsx /root/promptopia-web/src/components/shared/copy-button.tsx"],
  ["promptopia-web/src/components/case/md-renderer.tsx", "/tmp/md-renderer.tsx", "cp /tmp/md-renderer.tsx /root/promptopia-web/src/components/case/md-renderer.tsx"],
];

c.on("ready", () => {
  console.log("✅ SSH");
  
  let uploaded = 0;
  for (const [local, tmp, cmd] of files) {
    const content = readFileSync(local, "utf-8");
    c.sftp((err, sftp) => {
      if (err) { console.error(err.message); return; }
      const ws = sftp.createWriteStream(tmp);
      ws.end(content);
      ws.on("close", () => {
        console.log(`✅ ${tmp} uploaded`);
        sftp.end();
        uploaded++;
        if (uploaded === files.length) {
          // sudo cp both files
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cp /tmp/copy-button.tsx /root/promptopia-web/src/components/shared/copy-button.tsx && cp /tmp/md-renderer.tsx /root/promptopia-web/src/components/case/md-renderer.tsx && echo COPIED'`, (e2, s2) => {
            let o2 = "";
            s2.on("close", () => {
              if (o2.includes("COPIED")) {
                console.log("✅ Files copied. Building...");
                c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -5 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
                  let o3 = "";
                  s3.on("data", (d) => o3 += d.toString());
                  s3.on("close", () => { console.log(o3.slice(-300)); c.end(); });
                });
              } else { console.log("Copy failed:", o2); c.end(); }
            });
            s2.on("data", (d) => o2 += d.toString());
          });
        }
      });
    });
  }
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
