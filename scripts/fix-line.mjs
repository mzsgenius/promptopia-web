// fix-line.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/page.tsx'
c=open(f).read()
c=c.replace('💻\\" },},', '💻\\" },')
open(f,'w').write(c)
print('Fixed')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
