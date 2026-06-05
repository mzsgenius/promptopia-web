// check-nginx-domain.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
curl -s http://127.0.0.1/baidu_verify_codeva-MudQJQfD6f.html
echo "---"
curl -s -H "Host: promptopia.cn" http://127.0.0.1/baidu_verify_codeva-MudQJQfD6f.html
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
