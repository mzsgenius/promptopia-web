// baidu-nginx.mjs — put file in nginx root
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'echo "cb82d2530e44b5546a7b9dcd378965fa" > /var/www/html/baidu_verify_codeva-7lXDrQN2eL.html && curl -s http://127.0.0.1/baidu_verify_codeva-7lXDrQN2eL.html'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
