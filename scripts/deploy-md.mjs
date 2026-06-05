// deploy-md.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "base64");
c.on("ready", () => {
  c.exec(`echo ${b64} | base64 -d | sudo tee "/root/promptopia-web/src/app/case/[slug]/page.tsx" > /dev/null && echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo RDY'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-200)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
