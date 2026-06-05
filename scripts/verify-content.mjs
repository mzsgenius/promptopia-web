// verify-content.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d=urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=5).read().decode()
# Find the article area
i=d.find('<article')
if i>0:
  snippet=d[i:i+1000]
  print(snippet[:600])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
