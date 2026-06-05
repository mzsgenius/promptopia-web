// baidu-verify.mjs — add Baidu verification meta tag
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
cd /root/promptopia-web
# Add baidu verification after the existing metadata
sed -i "s|<meta name=\"next-size-adjust\"|<meta name=\"baidu-site-verification\" content=\"codeva-7lXDrQN2eL\" />\\n    <meta name=\"next-size-adjust\"|" src/app/layout.tsx
grep "baidu" src/app/layout.tsx
# Rebuild + restart
npx next build 2>&1 | tail -3
pm2 restart promptopia 2>/dev/null
echo "DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-400)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
