// quick-check.mjs
import { Client } from "ssh2";
const c = new Client();

// Try a simple no-data command to test SSH connectivity
c.on("ready", () => {
  c.exec("hostname", (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log("Connected:", o.trim()); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
