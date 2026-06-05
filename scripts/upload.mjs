// upload.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Upload 7 files: write to /tmp, then sudo mv
const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
  "src/app/case/[slug]/page.tsx",
];

let idx = 0;

c.on("ready", () => {
  next();

  function next() {
    if (idx >= files.length) {
      // sudo mv all files
      const mvs = files.map(f => {
        const t = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        const tmp = f.replace(/[/\[\]]/g, '_');
        return `sudo mv /tmp/${tmp} /root/promptopia-web/${t}`;
      }).join(" && ");
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '${mvs} && cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(o.slice(-300)); c.end(); });
      });
      return;
    }

    const f = files[idx];
    const content = readFileSync(`promptopia-web/${f}`, "utf-8");  
    const tmpName = f.replace(/[/\[\]]/g, '_');

    // Write via exec stdin pipe - NO sudo needed for /tmp/
    c.exec(`base64 -d > /tmp/${tmpName}`, (e, stream) => {
      if (e) { console.log(`${f.split('/').pop()}: ❌ ${e.message}`); idx++; setTimeout(next, 500); return; }
      stream.on("close", () => {
        console.log(`${f.split('/').pop()}: ✅`);
        idx++;
        setTimeout(next, 300);
      });
      stream.on("error", () => {});
      stream.stdin.end(Buffer.from(content).toString("base64"));
    });
  }
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
