// check-html-final.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2 | python3 -c "
import sys
d=sys.stdin.read()
i=d.find('<article')
if i>0:
    snippet=d[i:i+200]
    # Check what classes the article has
    print('Article:', snippet[:150])
else:
    print('NO ARTICLE')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
