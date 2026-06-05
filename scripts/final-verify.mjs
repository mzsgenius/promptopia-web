// final-verify.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
# Check detail page
d = urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=5).read().decode()
print('hljs:',d.count('hljs'),'pre:',d.count('<pre'),'img:',d.count('<img'))
# Check create page has MD editor
d2 = urllib.request.urlopen('http://127.0.0.1:3000/case/new',timeout=5).read().decode()
print('editor:','w-md-editor' in d2)
print('copy:','复制' in d or '已复制' in d)
" 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
