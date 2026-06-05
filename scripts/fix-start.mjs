// fix-start.mjs — fix start command and launch
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  const cmds = `
cd /root/promptopia-web
# Fix start command to not use $PORT
sed -i 's/next start -p \\$PORT/next start/' package.json
grep '"start"' package.json
# Clean old logs
pm2 flush
# Start fresh
pm2 start npm --name "promptopia" -- start
sleep 6
pm2 status
curl -s -o /dev/null -w "HTTP: %{http_code}\\n" http://localhost:3000
  `.trim();
  c.exec(cmds, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("HTTP: 200")) console.log("\n✅ http://150.109.70.58:3000 已上线！");
      c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
