// test-category.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/category/ai-programming 2>&1 | python3 -c "
import sys
d=sys.stdin.buffer.read().decode('utf-8', errors='replace')
# Extract title
import re
t = re.search(r'<title>(.*?)</title>', d)
print('Title:', t.group(1) if t else 'NOT FOUND')
# Check for case count
if '暂无相关案例' in d:
    print('Empty: no cases')
else:
    count = d.count('data-slot=\"card\"')
    print(f'Found {count} case cards')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
