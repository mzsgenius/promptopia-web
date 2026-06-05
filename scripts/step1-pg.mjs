// step1-pg.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S apt-get install -y -qq postgresql postgresql-client 2>&1 | tail -3`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("Setting up")) console.log("✅ PG installed");
      else console.log("⚠️ Check output");
      c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
