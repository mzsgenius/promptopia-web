// fix-final.mjs
import { Client } from "ssh2";
const c = new Client();

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web

# Add @plugin to globals.css (after tw-animate-css line)
sed -i "/@import \\"tw-animate-css\\";/a @plugin \\"@tailwindcss/typography\\";" src/app/globals.css
grep "typography" src/app/globals.css

# Rebuild
npm run build 2>&1 | tail -5
pm2 restart promptopia

echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-300)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
