// diag.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000 && echo " next" && curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:80 && echo " nginx"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
