// check-file2.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec("wc -c /tmp/about-case.md && head -c 50 /tmp/about-case.md", (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
