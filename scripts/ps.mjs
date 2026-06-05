// ps-detail.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`ps aux | grep next | grep -v grep && echo "---" && ls -la /proc/$(lsof -ti:3000)/fd 2>/dev/null | head -5`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
