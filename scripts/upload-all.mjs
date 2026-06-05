// upload-all.mjs — upload all changed files and rebuild
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/components/case/case-card.tsx",
  "src/components/case/search-bar.tsx",
  "next.config.ts",
];

function encode(path) {
  return { path, b64: readFileSync(`promptopia-web/${path}`, "base64") };
}

const encoded = files.map(encode);

c.on("ready", () => {
  console.log("✅ SSH, uploading files...");

  let idx = 0;
  function uploadNext() {
    if (idx >= encoded.length) {
      console.log("All files uploaded, rebuilding...");
      // Rebuild + restart
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE
'`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.stderr.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(o.slice(-300)); c.end(); });
      });
      return;
    }

    const { path, b64 } = encoded[idx];
    console.log(`  ${path}...`);
    c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${path} > /dev/null && echo OK`, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.stderr.on("data", (d) => o += d.toString());
      s.on("close", () => {
        if (o.includes("OK")) {
          idx++;
          uploadNext();
        } else {
          console.log(`❌ ${path}`);
          c.end();
        }
      });
    });
  }

  uploadNext();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
