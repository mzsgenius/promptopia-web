// check-nginx.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
systemctl status nginx --no-pager 2>&1 | head -10
echo "---"
curl -s -o /dev/null -w "nginx: %{http_code}\\n" http://localhost:80
curl -s -o /dev/null -w "next: %{http_code}\\n" http://localhost:3000
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
