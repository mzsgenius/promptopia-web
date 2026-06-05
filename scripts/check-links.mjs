// check-links.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "=== case page ==="
grep -n "href.*/" /root/promptopia-web/src/app/case/\\[slug\\]/page.tsx | head -5
echo "=== category page ==="
grep -n "href.*/" /root/promptopia-web/src/app/category/\\[slug\\]/page.tsx | head -5
echo "=== tag page ==="
grep -n "href.*/" /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx | head -5
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
