// upload-v3.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
  "src/app/case/[slug]/page.tsx",
];

c.on("ready", () => {
  console.log("✅ SSH\n");
  let i = 0;
  
  function uploadNext() {
    if (i >= files.length) {
      // All uploaded, now sudo mv each one to the right place
      console.log("Moving files to final locations...");
      const mvCmds = files.map(f => {
        const tmpName = f.replace(/[/\[\]]/g, '_');
        const target = f.replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]');
        return `sudo mv /tmp/pt_${tmpName} /root/promptopia-web/${target}`;
      }).join(" && ");
      
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '${mvCmds}'`, (e, s) => {
        let o = "";
        s.on("close", () => {
          console.log("✅ All files moved. Building...");
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
            let o2 = "";
            s2.on("data", (d) => o2 += d.toString());
            s2.on("close", () => { console.log(o2.slice(-300)); c.end(); });
          });
        });
        s.on("data", (d) => o += d.toString());
      });
      return;
    }

    const f = files[i];
    const content = readFileSync(`promptopia-web/${f}`, "utf-8");
    const b64 = Buffer.from(content).toString("base64");
    const tmpName = `pt_${f.replace(/[/\[\]]/g, '_')}`;

    // Pipe base64 through SSH to write to /tmp/ (no sudo needed)
    c.exec(`base64 -d > /tmp/${tmpName}`, (e, stream) => {
      if (e) { console.error(e); return; }
      let o = "";
      stream.on("close", () => {
        console.log(`  ${f.split('/').pop()}: ✅`);
        i++;
        uploadNext();
      });
      stream.on("data", (d) => o += d.toString());
      stream.stdin.end(b64);
    });
  }
  
  uploadNext();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
