// debug.mjs — check port and process
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`ss -tlnp | grep node && pm2 logs promptopia --lines 5 --nostream && curl -v http://localhost:3000 2>&1 | tail -5`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
