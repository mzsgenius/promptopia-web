// check.mjs — verify deployment
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000", (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(`HTTP: ${o}`); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
