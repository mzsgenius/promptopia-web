// check-table-style.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/doubao-xianyu-2500 | python3 -c "
import sys
d=sys.stdin.read()
print('has prose table:', 'prose table' in d)
print('has style tag:', '<style>' in d)
# Find the inline style
i=d.find('.prose table')
if i>0:
    print('INLINE STYLE FOUND')
else:
    print('NO INLINE STYLE')
# Check if table has any border-related style
j=d.find('<table')
if j>0:
    snippet=d[j:j+300]
    print('Table HTML:', repr(snippet[:200]))
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
