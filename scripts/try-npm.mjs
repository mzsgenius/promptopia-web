// try-npm-start.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`kill -9 $(lsof -ti:3000) 2>/dev/null; sleep 1; cd /root/promptopia-web && npm run start 2>&1 &
PID=$!; sleep 8; echo "PID=$PID"; ss -tlnp | grep 3000; curl -s --max-time 5 -o /dev/null -w "%%{http_code}" http://localhost:3000 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
