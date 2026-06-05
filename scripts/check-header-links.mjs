// check-header-links.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  // Check all href patterns in rendered HTML
  c.exec(`python3 -c "
import urllib.request, re
d = urllib.request.urlopen('http://127.0.0.1:3000').read().decode()
# Find all links
links = re.findall(r'href=\\\\\"(.*?)\\\\\"', d)
print('All hrefs:', links[:10])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
