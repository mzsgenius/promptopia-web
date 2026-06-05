// check-prisma.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
head -3 /root/promptopia-web/src/generated/prisma/client.ts
ls /root/promptopia-web/src/generated/prisma/*.js 2>/dev/null
ls /root/promptopia-web/src/generated/prisma/*.mjs 2>/dev/null
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
