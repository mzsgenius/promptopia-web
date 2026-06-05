// list-cases.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://localhost:3000/api/case/list?page=1\\&pageSize=30 | python3 -c "
import sys,json
d=json.load(sys.stdin)
for c in d['cases']:
    print(c['title'][:55])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
