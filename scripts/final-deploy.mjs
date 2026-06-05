// final-deploy.mjs — kill default app, start PrompTopia on port 80
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  console.log("✅ SSH");
  const cmds = `
# Kill default Tencent app
kill -9 $(lsof -ti:80) 2>/dev/null
sleep 1

# Start PrompTopia on port 80
cd /root/promptopia-web
npx next start -p 80 &
sleep 5

# Check
curl -s -o /dev/null -w "HTTP: %{http_code}\n" http://localhost:80
  `.trim();

  conn.exec(cmds, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", (code) => {
      console.log(o);
      if (o.includes("HTTP: 200")) {
        console.log("\n✅ PrompTopia 已上线！");
        console.log("   访问 http://150.109.70.58");
      }
      conn.end();
    });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
