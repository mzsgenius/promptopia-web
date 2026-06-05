// fix-page-tsx.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Read local page.tsx and add table CSS to the inline style
let content = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "utf-8");

// Add table CSS to the existing style tag
const tableCss = `.prose table{width:100%;border-collapse:collapse;margin-bottom:1rem}.prose th,.prose td{border:1px solid #d1d5db;padding:0.5rem 0.75rem;text-align:left}.dark .prose th,.dark .prose td{border-color:#4b5563}.prose th{background:#f9fafb;font-weight:500}.dark .prose th{background:#1f2937}`;

// Insert table CSS before the closing of the style string
content = content.replace(
  'color:#60a5fa"}} />',
  `color:#60a5fa}${tableCss}"}} />`
);

console.log("Has table CSS:", content.includes("border-collapse"));

c.on("ready", () => {
  const b64 = Buffer.from(content).toString("base64");
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws = sftp.createWriteStream("/tmp/page.tsx");
    ws.end(content);
    ws.on("close", () => {
      console.log("✅ Uploaded");
      sftp.end();
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'mv /tmp/page.tsx "/root/promptopia-web/src/app/case/[slug]/page.tsx" && cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
