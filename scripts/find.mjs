// find.mjs — find what's on port 80 and 3000
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`ss -tlnp | grep -E ":(80|3000)" && lsof -ti:80 | xargs -I{} ps -p {} -o cmd= 2>/dev/null`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
