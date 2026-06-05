// verify-md2.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2').read().decode()
# Count h2 tags
count = d.count('<h2')
print('total h2 tags:', count)
# Find all h2s
import re
h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', d)
for h in h2s:
    print('  h2:', h[:60])
# Check if article has ReactMarkdown rendered content
body_start = d.find('>## 背景问题<')
print('has raw ##:', body_start >= 0)
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
