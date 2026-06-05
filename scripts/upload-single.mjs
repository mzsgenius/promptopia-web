// upload-single.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

async function upload(path) {
  const content = readFileSync(`promptopia-web/${path}`, "utf-8");
  const escaped = content.replace(/'/g, "'\\''");
  return new Promise((resolve) => {
    c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cat > /root/promptopia-web/${path} << '"'"'EOF'"'"'
${escaped}
'"'"'EOF'"'"'
'`, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.stderr.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
  });
}

const files = [
  "src/app/category/[slug]/page.tsx",
  "src/app/tag/[slug]/page.tsx",
  "src/app/case/[slug]/page.tsx",
];

let idx = 0;
c.on("ready", async () => {
  console.log("✅ SSH");
  for (const f of files) {
    console.log(`Uploading ${f}...`);
    const r = await upload(f);
    console.log(r.slice(-100));
  }
  console.log("Rebuilding...");
  const r2 = await upload("package.json"); // skip, just test connection
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, () => {
    setTimeout(() => {
      c.exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log("HTTP:", o); c.end(); });
      });
    }, 8000);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
