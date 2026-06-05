// fix-md-final.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "utf-8");
const b64 = Buffer.from(content).toString("base64");

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
import base64
data = base64.b64decode('${b64}')
open('/root/promptopia-web/src/app/case/[slug]/page.tsx', 'wb').write(data)
print('WROTE')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("WROTE")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILD_OK'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
