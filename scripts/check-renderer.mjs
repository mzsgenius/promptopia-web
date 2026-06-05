// check-renderer.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`ls -la /root/promptopia-web/src/components/case/md-renderer.tsx 2>&1 && head -c 60 /root/promptopia-web/src/components/case/md-renderer.tsx`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
