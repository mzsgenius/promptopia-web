// baidu-file.mjs — upload verification file
import { Client } from "ssh2";
const c = new Client();
const content = "cb82d2530e44b5546a7b9dcd378965fa";
const b64 = Buffer.from(content).toString("base64");

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
import base64
data = base64.b64decode('${b64}')
open('/root/promptopia-web/public/baidu_verify_codeva-7lXDrQN2eL.html', 'w').write(data.decode())
print('OK')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      if (o.includes("OK")) {
        console.log("✅ File uploaded, verifying...");
        // Verify from public
        c.exec(`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/baidu_verify_codeva-7lXDrQN2eL.html`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(`HTTP: ${o2}`); c.end(); });
        });
      } else {
        console.log("❌", o);
        c.end();
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
