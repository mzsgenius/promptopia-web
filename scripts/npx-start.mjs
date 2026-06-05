// npx-start.mjs — try with npx
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`cd /root/promptopia-web && npx next start -p 3000 2>&1 &
sleep 8
curl -s -o /dev/null -w "%%{http_code}" http://localhost:3000
echo ""
curl -s http://localhost:3000 | head -c 100`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-400)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
