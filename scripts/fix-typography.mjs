// fix-typography.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Install tailwind typography plugin
cd /root/promptopia-web && npm install @tailwindcss/typography 2>&1 | tail -2

# Add typography to CSS
sed -i "s|@import \"tw-animate-css\";|@import \"tw-animate-css\";\\n@plugin \"@tailwindcss/typography\";|" src/app/globals.css

# Restore prose on article
sed -i "s|className=\\"max-w-none mb-8\\">|className=\\"prose prose-neutral dark:prose-invert max-w-none mb-8\\">|" "/root/promptopia-web/src/app/case/[slug]/page.tsx"

echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o || "OK");
      if (o.includes("DONE") || o.includes("@tailwindcss/typology")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -5 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
