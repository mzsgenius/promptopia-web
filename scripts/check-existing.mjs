// check-existing.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/api/case/list?pageSize=50 | python3 -c "
import sys,json
d=json.load(sys.stdin)
for x in d['cases']:
    print(x['title'][:55] + ' | ' + x['category'])
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
