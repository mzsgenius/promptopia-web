// fix-pm2.mjs — fix PM2 config and restart
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  // Kill port 80, fix PM2, restart
  const cmds = `
kill -9 $(lsof -ti:80) 2>/dev/null
cd /root/promptopia-web
pm2 delete promptopia 2>/dev/null
PORT=80 npx next start -p 80 &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:80
  `.trim();
  conn.exec(cmds, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
