// upload-batch.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Build a single bash script that handles all files
const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
  "src/app/case/[slug]/page.tsx",
];

// For each file, encode as base64 and create: echo B64 | base64 -d > /tmp/NAME
let bashScript = "set -e\n";
for (const f of files) {
  const content = readFileSync(`promptopia-web/${f}`, "utf-8");
  const b64 = Buffer.from(content).toString("base64");
  const tmpName = f.replace(/[/\[\]]/g, '_');
  bashScript += `echo ${b64} | base64 -d > /tmp/${tmpName}\n`;
}

// Move commands
for (const f of files) {
  const tmpName = f.replace(/[/\[\]]/g, '_');
  const target = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  bashScript += `sudo mv /tmp/${tmpName} /root/promptopia-web/${target}\n`;
}

// Build + restart
bashScript += `cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo ALL_DONE\n`;

// Write script to /tmp on server, then execute
const scriptB64 = Buffer.from(bashScript).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH\nSending batch script...");
  
  // Write script via stdin pipe
  c.exec(`base64 -d > /tmp/deploy.sh`, (e, stream) => {
    if (e || !stream) { console.error("Failed to create stream"); c.end(); return; }
    stream.on("close", () => {
      console.log("Script written, executing...");
      // Execute
      c.exec(`echo Mmzzss060112 | sudo -S bash /tmp/deploy.sh`, (e2, s2) => {
        let o = "";
        s2.on("data", (d) => o += d.toString());
        s2.stderr.on("data", (d) => o += d.toString());
        s2.on("close", () => { console.log(o.slice(-500)); c.end(); });
      });
    });
    stream.stdin.end(scriptB64);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
