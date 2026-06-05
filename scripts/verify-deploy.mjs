// verify-deploy.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
# Check home page
d=urllib.request.urlopen('http://127.0.0.1:3000',timeout=5).read().decode()
print('Home:', '200 OK' if 'PrompTopia' in d else 'FAIL')

# Check create page has MD editor
d=urllib.request.urlopen('http://127.0.0.1:3000/case/new',timeout=5).read().decode()
print('Editor:', 'react-md-editor' in d or 'w-md-editor' in d)

# Check detail page has enhanced rendering
d=urllib.request.urlopen('http://127.0.0.1:3000/case/chatgpt-xiaohongshu-wenan-3000-a1b2',timeout=5).read().decode()
print('Code hljs:', 'hljs' in d)
print('Copy btn:', '复制' in d)
print('Images:', '<img' in d)
" 2>&1 | head -10`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
