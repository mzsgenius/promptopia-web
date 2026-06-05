// final-verify-md.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=10).read().decode()
h2 = d.count('<h2')
h3 = d.count('<h3')
ul = d.count('<ul')
code = d.count('<code')
pre = d.count('<pre')
raw = '## \\u80cc\\u666f' in d  # ## 背景
print('h2:', h2, 'h3:', h3, 'ul:', ul, 'code:', code, 'pre:', pre, 'raw_md:', raw)
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
