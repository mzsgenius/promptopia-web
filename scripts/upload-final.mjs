// upload-final.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  ["src/components/case/md-editor.tsx", "me.tsx"],
  ["src/components/case/md-renderer.tsx", "mr.tsx"],
  ["src/components/shared/copy-button.tsx", "cb.tsx"],
  ["src/app/api/case/upload/route.ts", "ur.ts"],
  ["src/app/case/new/page.tsx", "np.tsx"],
  ["src/app/globals.css", "gc.css"],
  ["src/app/case/[slug]/page.tsx", "sp.tsx"],
];

let idx = 0;

c.on("ready", () => {
  console.log("✅ SSH\n");
  next();

  function next() {
    if (idx >= files.length) {
      // All uploaded to /tmp, now sudo mv all
      const mvs = files.map(([orig, tmp]) => {
        const t = orig.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        return `mv /tmp/pt_${tmp} /root/promptopia-web/${t}`;
      }).join(" && ");
      
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '${mvs}'`, (e, s) => {
        let o = "";
        s.on("close", () => {
          console.log("✅ Moved. Building...");
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
            let o2 = "";
            s2.on("data", (d) => o2 += d.toString());
            s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
          });
        });
        s.on("data", (d) => o += d.toString());
      });
      return;
    }

    const [orig, tmpName] = files[idx];
    const content = readFileSync(`promptopia-web/${orig}`, "utf-8");
    const b64 = Buffer.from(content).toString("base64");
    
    // Write via stdin pipe to base64 -d (no command-line args)
    c.exec(`base64 -d > /tmp/pt_${tmpName}`, (e, stream) => {
      if (e || !stream) { console.log(`  ${orig.split('/').pop()}: ERR`); idx++; setTimeout(next, 500); return; }
      stream.on("close", () => {
        // Verify
        c.exec(`wc -c < /tmp/pt_${tmpName}`, (e2, s2) => {
          let sz = "";
          s2.on("data", (d) => sz += d.toString());
          s2.on("close", () => {
            const bytes = parseInt(sz.trim());
            console.log(`  ${orig.split('/').pop()}: ${bytes} bytes`);
            idx++;
            setTimeout(next, 300);
          });
        });
      });
      stream.stdin.end(b64);
    });
  }
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
