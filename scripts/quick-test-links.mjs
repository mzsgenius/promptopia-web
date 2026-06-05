// quick-test-links.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  // Test pages from the server directly via curl 
  c.exec(`python3 -c "
import urllib.request, re
pages = ['/', '/case/chatgpt-xiaohongshu-wenan-3000-a1b2', '/category/ai-fuye', '/tag/ChatGPT']
for p in pages:
    d = urllib.request.urlopen('http://127.0.0.1:3000' + p).read().decode()
    links = re.findall(r'href=\"/\"[^>]*>[^<]*返回', d)
    print(p + ': ' + str(len(links)) + ' back links')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
