// verify-detail.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request, re
d=urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=5).read().decode()
print('server:','hljs' in d,'pre:',len(re.findall(r'<pre',d)),'img:',len(re.findall(r'<img',d)))
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o || '(no output)'); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
