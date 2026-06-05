// try-upload.mjs
import { Client } from "ssh2";
import { readFileSync, writeFileSync } from "fs";
const c = new Client();

// Write ALL file contents to /tmp/ locally first
const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
  "src/app/case/[slug]/page.tsx",
];

// Build a complete bash script that recreates all files using echo
let script = "#!/bin/bash\nset -e\n";

for (const f of files) {
  const content = readFileSync(`promptopia-web/${f}`, "utf-8");
  const tmpName = f.replace(/[/\[\]]/g, '_');
  const target = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  
  // Write content as hex bytes using printf to avoid all escaping issues
  const hex = Buffer.from(content).toString("hex");
  script += `printf '${hex}' | xxd -r -p > /tmp/${tmpName}\n`;
  script += `sudo mv /tmp/${tmpName} /root/promptopia-web/${target}\n`;
}

script += `cd /root/promptopia-web && npm run build 2>&1 | tail -3\npm2 restart promptopia\necho SUCCESS\n`;

writeFileSync("/tmp/deploy-script.sh", script);
console.log("Script written locally:", (script.length / 1024).toFixed(1), "KB");
console.log("Hex chars:", script.length);

// Now SSH and run the script
c.on("ready", () => {
  console.log("✅ SSH, writing script to server...");
  const scriptContent = readFileSync("/tmp/deploy-script.sh", "utf-8");
  const b64 = Buffer.from(scriptContent).toString("base64");
  
  c.exec(`base64 -d > /tmp/deploy-script.sh`, (e, stream) => {
    if (e) { console.error(e.message); c.end(); return; }
    stream.on("close", () => {
      console.log("Script uploaded, executing...");
      c.exec(`echo Mmzzss060112 | sudo -S bash /tmp/deploy-script.sh`, (e2, s2) => {
        let o = "";
        s2.on("data", (d) => o += d.toString());
        s2.stderr.on("data", (d) => o += d.toString());
        s2.on("close", () => { console.log(o.slice(-500)); c.end(); });
      });
    });
    stream.on("error", () => {});
    stream.stdin.end(Buffer.from(scriptContent).toString("base64"));
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
