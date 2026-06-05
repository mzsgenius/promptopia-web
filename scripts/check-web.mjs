// check-web.mjs — verify the site is actually up
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  conn.exec(`curl -s http://localhost:80 | head -c 200`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(0, 200)); conn.end(); });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
