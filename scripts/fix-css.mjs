// fix-css.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web

# Read current globals.css first line to check order
head -5 src/app/globals.css

# Fix: put @plugin right after @import "tailwindcss"
# Remove existing @plugin line
sed -i "/@plugin/d" src/app/globals.css
# Insert after the @import "tailwindcss" line
sed -i "/^@import \\"tailwindcss\\";/a @plugin \\"@tailwindcss/typography\\";" src/app/globals.css

echo "---"
head -5 src/app/globals.css

echo "---BUILD---"
npm run build 2>&1 | tail -5
pm2 restart promptopia
echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-400)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
