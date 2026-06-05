// check-any-css.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S grep "font-size.*1.5rem" /root/promptopia-web/.next/static/chunks/*.css 2>/dev/null | head -2`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o || "NOT FOUND"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
