// debug-nginx.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
ls -la /var/www/html/
cat /var/www/html/baidu_verify_codeva-7lXDrQN2eL.html
curl -s http://127.0.0.1/baidu_verify_codeva-7lXDrQN2eL.html | head -c 200
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
