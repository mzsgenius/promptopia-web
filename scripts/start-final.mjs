// start-final.mjs — start next correctly
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  const cmd = `
cd /root/promptopia-web && \
pm2 delete promptopia 2>/dev/null && \
pm2 start npm --name "promptopia" -- start && \
sleep 6 && \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
  `.trim();
  conn.exec(cmd, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("200")) console.log("\n✅ http://150.109.70.58:3000");
      conn.end();
    });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
