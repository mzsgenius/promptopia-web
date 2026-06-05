// debug-detail.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d=urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=5).read().decode()
i=d.find('<article')
if i<0:
    print('NO_ARTICLE_TAG')
else:
    snippet=d[i:i+400]
    # Write to file for inspection
    with open('/tmp/debug.html','w') as f:
        f.write(snippet)
    print('article found, length:', len(snippet))
    print(snippet[:300])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
