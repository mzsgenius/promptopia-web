// check-bing.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`host -t txt promptopia.cn 2>/dev/null || dig txt promptopia.cn +short 2>/dev/null || echo "DNS_CHECK_FAILED"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
