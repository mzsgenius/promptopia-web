// debug-upload.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'echo "=== TMP ==="; wc -c /tmp/pg2.tsx; echo "=== TARGET ==="; wc -c "/root/promptopia-web/src/app/case/[slug]/page.tsx"; echo "=== GREP ==="; grep -c "MarkdownRenderer" "/root/promptopia-web/src/app/case/[slug]/page.tsx"'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
