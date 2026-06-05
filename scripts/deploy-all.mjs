// deploy-all.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/case/[slug]/page.tsx",
  "src/app/globals.css",
];

async function upload(file) {
  const b64 = readFileSync(`promptopia-web/${file}`, "base64");
  const escaped = file.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  const r = await new Promise(resolve => {
    c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${escaped} > /dev/null`, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
  });
  return r;
}

c.on("ready", async () => {
  console.log("✅ SSH\nUploading files...");
  for (const f of files) {
    const r = await upload(f);
    console.log(`  ${f.split("/").pop()}: ${r.includes("OK") || r === "" ? "✅" : "❌"}`);
  }
  console.log("\nBuilding...");
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-300)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
