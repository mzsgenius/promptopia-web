// check-docker.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`which docker && docker --version`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o || "Docker not found"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
