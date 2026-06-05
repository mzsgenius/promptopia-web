// direct.mjs — use direct path to next
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`cd /root/promptopia-web && PORT=3000 node node_modules/next/dist/bin/next start 2>&1 &
sleep 6
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
echo ""
curl -s http://localhost:3000 | head -c 80`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
