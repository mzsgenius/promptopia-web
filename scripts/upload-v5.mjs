// upload-v5.mjs
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

let idx = 0;
c.on("ready", async () => {
  console.log("✅ SSH");
  
  while (idx < files.length) {
    const f = files[idx];
    const content = readFileSync(`promptopia-web/${f}`, "utf-8");
    const b64 = Buffer.from(content).toString("base64");
    
    const result = await new Promise(resolve => {
      c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${f.replace(/\[/g, '\\[').replace(/\]/g, '\\]')} > /dev/null`, (e, s) => {
        let o = "";
        s.on("close", () => resolve("OK"));
        s.on("error", () => resolve("ERR"));
        s.on("data", (d) => o += d.toString());
        s.stderr.on("data", (d) => o += d.toString());
        // Close after 5s regardless
        setTimeout(() => { if (!o) resolve("TIMEOUT"); }, 5000);
      });
    });
    console.log(`  ${idx+1}/${files.length} ${f.split('/').pop()}: ${result}`);
    idx++;
  }
  
  console.log("\nBuilding...");
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, () => {
    c.end();
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
