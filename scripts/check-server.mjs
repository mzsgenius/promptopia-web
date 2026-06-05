// check-server.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "=== globals.css @plugin ==="
grep "plugin" /root/promptopia-web/src/app/globals.css
echo ""
echo "=== article class ==="
grep "article" "/root/promptopia-web/src/app/case/[slug]/page.tsx" | head -3
echo ""
echo "=== typography installed ==="
ls /root/promptopia-web/node_modules/@tailwindcss/typography/package.json 2>&1
echo ""
echo "=== rendered HTML ==="
curl -s http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2 | python3 -c "
import sys
d=sys.stdin.read()
i=d.find(\"<article\")
if i>0: print(d[i:i+300])
"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
