// baidu3.mjs — add via sed
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
cd /root/promptopia-web
# Insert verification after homepage URL line
sed -i "s|url: \\\`\\\${SITE_URL}/case/\\\${slug}\\\`|url: \\\`\\\${SITE_URL}/case/\\\${slug}\\\`,\\n    verification: { other: { \\\"baidu-site-verification\\\": \\\"codeva-7lXDrQN2eL\\\" } }|" src/app/case/[slug]/page.tsx
# Check it was added
grep "baidu" src/app/case/[slug]/page.tsx
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
