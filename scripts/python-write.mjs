// write-via-python.mjs — use python on server to write file
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/src/app/layout.tsx", "base64");

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
import base64, sys
data = base64.b64decode(sys.argv[1])
open('/root/promptopia-web/src/app/layout.tsx', 'wb').write(data)
print('OK')
" ${b64}`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", (code) => {
      console.log(o);
      if (o.includes("OK")) {
        // Verify
        c.exec(`echo Mmzzss060112 | sudo -S grep baidu /root/promptopia-web/src/app/layout.tsx`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            if (o2.includes("baidu")) {
              console.log("✅ baidu tag verified");
              // Rebuild
              c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -2 && pm2 restart promptopia && echo BUILT'`, (e3, s3) => {
                let o3 = "";
                s3.on("data", (d) => o3 += d.toString());
                s3.on("close", () => { console.log(o3.slice(-300)); c.end(); });
              });
            } else {
              console.log("❌ not found");
              c.end();
            }
          });
        });
      } else {
        c.end();
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
