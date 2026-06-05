// baidu-quick.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "901ee9128a151840d31e0a88fd674249" > /var/www/html/baidu_verify_codeva-MudQJQfD6f.html
curl -s http://127.0.0.1/baidu_verify_codeva-MudQJQfD6f.html
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
