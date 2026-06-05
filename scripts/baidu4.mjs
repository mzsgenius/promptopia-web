// baidu4.mjs — simplest: add to layout.tsx metadata
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
cd /root/promptopia-web

# Add baidu verification to layout metadata
sed -i "/^export const metadata/a\  other: { \"baidu-site-verification\": \"codeva-7lXDrQN2eL\" }," src/app/layout.tsx

grep -A2 "baidu" src/app/layout.tsx
echo "---"

# Rebuild and restart
npm run build 2>&1 | tail -3
pm2 restart promptopia 2>/dev/null
echo "DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
