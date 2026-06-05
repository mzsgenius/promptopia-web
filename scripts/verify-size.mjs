// verify-size.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/tongyi-xiaohongshu-5000 | python3 -c "
import sys
d=sys.stdin.read()
# Count approx content length by looking for article area
i=d.find('<article')
if i>0:
    j=d.find('</article',i)
    article_len=j-i
    print('Article area:', article_len, 'chars')
    # Count tables
    print('Tables:', d.count('<table'))
    print('HTTP:', '200 OK')
" 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o || "no output"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
