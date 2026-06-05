// check-exact-end.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/case/[slug]/page.tsx'
c=open(f).read()
i=c.rfind('60a5fa')
if i>0: print(repr(c[i:i+50]))
else: print('NOT FOUND')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
