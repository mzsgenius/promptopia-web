// upload-b64.mjs — simpler base64 piped approach
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/src/app/layout.tsx", "base64");

c.on("ready", () => {
  // Write file via base64 pipe through sudo
  c.exec(`base64 -d | sudo tee /root/promptopia-web/src/app/layout.tsx > /dev/null`, (e, stream) => {
    stream.stdin.end(b64);
    stream.on("close", () => {
      // Verify
      c.exec(`echo 'Mmzzss060112' | sudo -S grep "baidu" /root/promptopia-web/src/app/layout.tsx`, (e2, s2) => {
        let o = "";
        s2.on("data", (d) => o += d.toString());
        s2.on("close", () => {
          if (o.includes("baidu")) {
            console.log("✅ baidu tag added, rebuilding...");
            c.exec(`echo 'Mmzzss060112' | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia 2>/dev/null && echo OK'`, (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => { console.log(o3.slice(-200)); c.end(); });
            });
          } else {
            console.log("❌ failed to add baidu tag");
            c.end();
          }
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
