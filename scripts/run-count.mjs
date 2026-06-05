// run-count.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/scripts/count-cats.js", "base64");
c.on("ready", () => {
  c.exec(`echo ${b64} | base64 -d | sudo tee /root/count-cats.js > /dev/null && echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" node /root/count-cats.js 2>&1`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
