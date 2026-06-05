// check-table-html.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/case/doubao-xianyu-2500 | python3 -c "
import sys, re
d=sys.stdin.read()
# Check table structure
tables = re.findall(r'<table[^>]*>.*?</table>', d, re.DOTALL)
print('Tables found:', len(tables))
for t in tables[:2]:
    # Check if it has border classes
    has_border = 'border' in t
    print(f'  Table ({len(t)} chars): has border class: {has_border}')
    print(f'  First 100 chars: {t[:100]}')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
