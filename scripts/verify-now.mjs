// verify-now.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/doubao-xianyu-2500 | python3 -c "
import sys
d=sys.stdin.read()
# Check for table
i=d.find('<table')
if i>0: print('Table found, first 200 chars:', d[i:i+200])
else: print('NO TABLE FOUND')
# Check HTTP
" 2>&1 && echo "---" && curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/case/doubao-xianyu-2500`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
