// stop-default.mjs — find and stop default service
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`systemctl list-units --type=service 2>/dev/null | grep -i node 2>/dev/null; systemctl list-units --type=service 2>/dev/null | grep lighthouse; ps aux | grep "app.js" | grep -v grep`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
