// measure.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Check server load
echo "=== Server Load ==="
uptime
free -h
echo ""

# Measure Next.js response time (internal, no nginx overhead)
echo "=== Next.js direct response time ==="
time curl -s -o /dev/null http://127.0.0.1:3000 2>&1

# Measure via Nginx
echo "=== Via Nginx ==="
time curl -s -o /dev/null http://127.0.0.1:80 2>&1

# Measure a case detail page
echo "=== Case page ==="
time curl -s -o /dev/null http://127.0.0.1:3000/api/case/list?page=1 2>&1

# Check current next.config
cat /root/promptopia-web/next.config.ts
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
