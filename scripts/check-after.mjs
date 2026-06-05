// check-after-fix.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`pm2 delete all 2>/dev/null; cd /root/promptopia-web && pm2 start "node node_modules/.bin/next start" --name promptopia && sleep 6 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo "" && curl -s http://localhost:3000 | head -c 100`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
