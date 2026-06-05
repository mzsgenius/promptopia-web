// deep-check.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "=== pg.tsx in /tmp ==="
wc -c /tmp/pg.tsx 2>&1
echo "=== target file ==="
wc -c "/root/promptopia-web/src/app/case/[slug]/page.tsx" 2>&1
echo "=== grep ==="
grep -c "MarkdownRenderer" "/root/promptopia-web/src/app/case/[slug]/page.tsx" 2>&1
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
