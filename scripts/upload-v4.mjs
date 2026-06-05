// upload-v4.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  ["src/app/api/case/upload/route.ts", "upload-route.ts"],
  ["src/components/shared/copy-button.tsx", "copy-button.tsx"],
  ["src/components/case/md-renderer.tsx", "md-renderer.tsx"],
  ["src/components/case/md-editor.tsx", "md-editor.tsx"],
  ["src/app/case/new/page.tsx", "case-new.tsx"],
  ["src/app/globals.css", "globals.css"],
  ["src/app/case/[slug]/page.tsx", "case-slug.tsx"],
];

c.on("ready", () => {
  console.log("✅ SSH\n");
  let i = 0;
  
  function uploadNext() {
    if (i >= files.length) {
      console.log("\nMoving files...");
      const mvCmds = files.map(([path]) => {
        const tmpName = `pt_${path.replace(/[/\[\]]/g, '_')}`;
        const target = path.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        return `mv /tmp/${tmpName} /root/promptopia-web/${target}`;
      }).join(" && ");
      
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '${mvCmds}'`, (e, s) => {
        let o = "";
        s.on("close", () => {
          console.log("✅ Files moved. Building...");
          c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo OK'`, (e2, s2) => {
            let o2 = "";
            s2.on("data", (d) => o2 += d.toString());
            s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
          });
        });
        s.on("data", (d) => o += d.toString());
      });
      return;
    }

    const [path, label] = files[i];
    const content = readFileSync(`promptopia-web/${path}`, "utf-8");
    const b64 = Buffer.from(content).toString("base64");
    const tmpName = `pt_${path.replace(/[/\[\]]/g, '_')}`;

    c.exec(`base64 -d > /tmp/${tmpName}`, (e, stream) => {
      if (e) { console.error(e); return; }
      stream.on("close", () => {
        // Verify file was written
        c.exec(`wc -c < /tmp/${tmpName}`, (e2, s2) => {
          let size = "";
          s2.on("data", (d) => size += d.toString());
          s2.on("close", () => {
            const bytes = parseInt(size.trim());
            console.log(`  ${label}: ${bytes} bytes ${bytes > 100 ? '✅' : '❌'}`);
            i++;
            setTimeout(uploadNext, 200);
          });
        });
      });
      stream.stdin.end(b64);
    });
  }
  
  uploadNext();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
