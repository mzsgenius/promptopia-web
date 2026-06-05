// check-table.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/doubao-xianyu-2500 | python3 -c "
import sys
d=sys.stdin.read()
# Find table area
i=d.find('<table')
if i>0:
    print('TABLE FOUND')
    print(d[i:min(i+500,len(d))])
else:
    print('NO TABLE TAG')
    # Check if prose table CSS exists in page
    print('has prose table:', 'prose table' in d)
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
