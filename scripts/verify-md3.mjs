// verify-md3.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2').read().decode()
# Check if content area exists
idx = d.find('项目背景')
if idx > 0:
    print('Found project background')
    print(d[max(0,idx-100):idx+200])
else:
    print('NOT FOUND')
    # Check what's in the article
    idx2 = d.find('<article')
    if idx2 > 0:
        snippet = d[idx2:idx2+500]
        print('Article starts with:', snippet[:300])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
