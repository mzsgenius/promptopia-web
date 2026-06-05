// check-prose.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000 2>&1 | python3 -c "
import sys, re
d=sys.stdin.read()
# Find CSS link
css_urls = re.findall(r'/_next/static/css/[^\"\\' ]+\\.css', d)
for url in css_urls:
    print('CSS:', url)
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { if(o) console.log(o); else console.log("no output"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
