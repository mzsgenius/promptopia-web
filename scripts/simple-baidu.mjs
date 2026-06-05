// simple-baidu.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo '901ee9128a151840d31e0a88fd674249' | sudo tee /var/www/html/baidu_verify_codeva-MudQJQfD6f.html > /dev/null && curl -s http://promptopia.cn/baidu_verify_codeva-MudQJQfD6f.html`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log("Result:", o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
