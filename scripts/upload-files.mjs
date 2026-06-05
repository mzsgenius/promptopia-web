// upload-files.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/app/category/[slug]/page.tsx",
  "src/app/tag/[slug]/page.tsx",
  "src/app/case/[slug]/page.tsx",
];

c.on("ready", async () => {
  console.log("✅ SSH");
  for (const f of files) {
    const b64 = readFileSync(`promptopia-web/${f}`, "base64");
    const escaped = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    await new Promise(resolve => {
      c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${escaped} > /dev/null`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(`  ${f}: OK`); resolve(); });
      });
    });
  }
  console.log("Rebuilding...");
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-300)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
