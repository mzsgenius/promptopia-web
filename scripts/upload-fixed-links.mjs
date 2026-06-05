// upload-fixed-links.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/app/category/[slug]/page.tsx",
  "src/app/tag/[slug]/page.tsx",
  "src/app/case/[slug]/page.tsx",
];

async function exec(cmd) {
  return new Promise((resolve) => {
    c.exec(cmd, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.stderr.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
  });
}

c.on("ready", async () => {
  console.log("✅ SSH\nUploading files...");
  
  for (const f of files) {
    const b64 = readFileSync(`promptopia-web/${f}`, "base64");
    const r = await exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${f} > /dev/null && echo OK`);
    console.log(`  ${f}: ${r.includes("OK") ? "✅" : "❌"}`);
  }

  console.log("\nRebuilding...");
  const r = await exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`);
  console.log(r.slice(-200));
  
  await new Promise(r => setTimeout(r, 5000));
  const v = await exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000 2>&1`);
  console.log("HTTP:", v);
  c.end();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
