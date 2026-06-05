// verify-final-md.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2').read().decode()
# Count h2 tags
h2_count = d.count('<h2')
h3_count = d.count('<h3')
ul_count = d.count('<ul')
code_count = d.count('<code')
has_raw_md = '>##' in d or '## 背景' in d
print('h2:' + str(h2_count) + ' h3:' + str(h3_count) + ' ul:' + str(ul_count) + ' code:' + str(code_count))
print('raw_md:' + str(has_raw_md))
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
