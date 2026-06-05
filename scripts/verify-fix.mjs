// verify-fix.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`python3 -c "
import urllib.request
d = urllib.request.urlopen('http://127.0.0.1:3000/category/ai-fuye').read().decode()
idx = d.find('返回首页')
if idx > 0:
    print(d[max(0,idx-60):idx+60])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
