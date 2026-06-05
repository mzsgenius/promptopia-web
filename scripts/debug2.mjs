// debug2.mjs — deep debug
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`
ls -la /root/promptopia-web/.next/BUILD_ID 2>/dev/null && echo "BUILD EXISTS" || echo "NO BUILD"
ls -la /root/promptopia-web/.env 2>/dev/null
pm2 logs promptopia --lines 20 --nostream 2>/dev/null
  `.trim(), (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
