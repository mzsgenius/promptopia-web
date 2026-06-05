// test-connection.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -v http://127.0.0.1:3000 2>&1 | head -15`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
