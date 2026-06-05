// check-firewall.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`iptables -L -n 2>/dev/null | head -20; echo "---"; firewall-cmd --list-ports 2>/dev/null; echo "---"; nmap -p 3000 localhost 2>/dev/null | tail -3`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
