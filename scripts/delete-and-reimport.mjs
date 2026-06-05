// delete-and-reimport.mjs
import { Client } from "ssh2";
const c = new Client();

c.on("ready", () => {
  // Delete old entry first
  c.exec(`echo Mmzzss060112 | sudo -S psql "postgresql://postgres:postgres@localhost:5432/promptopia" -c "DELETE FROM \\"Case\\" WHERE slug='doubao-xianyu-2500'" 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log("Delete:", o.trim());
      // Now re-import
      c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/import.cjs`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => { console.log("Import:", o2.trim()); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
