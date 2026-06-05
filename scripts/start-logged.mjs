// start-logged.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`kill -9 $(lsof -ti:3000) 2>/dev/null; cd /root/promptopia-web && npx next start -p 3000 > /tmp/next.log 2>&1 &
sleep 6 && cat /tmp/next.log && echo "---CURL---" && curl -s --max-time 5 -o /dev/null -w "HTTP: %{http_code}\\n" http://127.0.0.1:3000`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
