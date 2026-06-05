// upload-both.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const content1 = readFileSync("promptopia-web/src/components/shared/copy-button.tsx", "utf-8");
const content2 = readFileSync("promptopia-web/src/components/case/md-renderer.tsx", "utf-8");

c.on("ready", () => {
  console.log("✅ SSH");
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    
    // Upload copy-button
    const ws1 = sftp.createWriteStream("/tmp/copy-button.tsx");
    ws1.end(content1);
    ws1.on("close", () => {
      console.log("✅ copy-button.tsx uploaded");
      
      // Upload md-renderer
      const ws2 = sftp.createWriteStream("/tmp/md-renderer.tsx");
      ws2.end(content2);
      ws2.on("close", () => {
        console.log("✅ md-renderer.tsx uploaded");
        sftp.end();
        
        // sudo cp + rebuild
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cp /tmp/copy-button.tsx /root/promptopia-web/src/components/shared/copy-button.tsx && cp /tmp/md-renderer.tsx /root/promptopia-web/src/components/case/md-renderer.tsx && echo COPIED'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            if (o2.includes("COPIED")) {
              console.log("✅ Files in place. Building...");
              c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -5 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
                let o3 = "";
                s3.on("data", (d) => o3 += d.toString());
                s3.on("close", () => { console.log(o3.slice(-300)); c.end(); });
              });
            } else { console.log("Copy failed:", o2); c.end(); }
          });
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
