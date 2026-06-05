// upload-layout.mjs — upload fixed layout.tsx via base64
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/src/app/layout.tsx", "base64");
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
echo ${b64} | base64 -d > /root/promptopia-web/src/app/layout.tsx
grep "baidu" /root/promptopia-web/src/app/layout.tsx
cd /root/promptopia-web && npm run build 2>&1 | tail -3
pm2 restart promptopia 2>/dev/null
echo "DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-300)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
