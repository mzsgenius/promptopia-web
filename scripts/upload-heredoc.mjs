// upload-heredoc.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/app/case/[slug]/page.tsx",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
  "src/app/api/case/upload/route.ts",
  "src/components/shared/copy-button.tsx",
];

let idx = 0;

c.on("ready", () => {
  console.log("✅ SSH\n");
  next();
  
  function next() {
    if (idx >= files.length) {
      console.log("\n🚀 Building...");
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(o.slice(-200)); c.end(); });
      });
      return;
    }
    
    const f = files[idx];
    const content = readFileSync(`promptopia-web/${f}`, "utf-8");
    const target = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    
    // Use python3 heredoc to write file (avoids all bash escaping issues)
    const pythonScript = `
import base64, sys
data = base64.b64decode(sys.stdin.read())
open('/root/promptopia-web/${target}', 'wb').write(data)
print('OK: ' + str(len(data)) + ' bytes')
`.trim();
    
    const b64 = Buffer.from(content).toString("base64");
    
    c.exec(`echo Mmzzss060112 | sudo -S python3 -c '${pythonScript.replace(/'/g, "'\\''")}'`, (e, stream) => {
      if (e || !stream) { console.log(`  ${f.split('/').pop()}: ERR ${e?.message}`); idx++; setTimeout(next, 300); return; }
      let o = "";
      stream.on("data", (d) => o += d.toString());
      stream.on("close", () => {
        console.log(`  ${f.split('/').pop()}: ${o.trim()}`);
        idx++;
        setTimeout(next, 300);
      });
      stream.stdin.end(b64);
    });
  }
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
