// run-pg-setup.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/scripts/pg-setup.sh", "base64");
c.on("ready", () => {
  c.exec(`echo ${b64} | base64 -d | sudo tee /tmp/pg-setup.sh > /dev/null && sudo bash /tmp/pg-setup.sh 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      // Quick verify
      c.exec(`curl -s -o /dev/null -w 'CODE:%{http_code}' http://127.0.0.1:3000 2>&1`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log("\n" + o2); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
