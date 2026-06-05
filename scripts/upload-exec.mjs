// upload-via-exec.mjs — write via sudo tee
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/layout.tsx", "utf-8");

c.on("ready", () => {
  console.log("✅ SSH");
  c.exec(`echo 'Mmzzss060112' | sudo -S tee /root/promptopia-web/src/app/layout.tsx > /dev/null`, (e, stream) => {
    if (e) { console.error(e); c.end(); return; }
    stream.stdin.end(content);
    stream.on("close", () => {
      console.log("✅ layout.tsx written");
      // Verify + rebuild
      c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
grep "baidu" /root/promptopia-web/src/app/layout.tsx
cd /root/promptopia-web && npm run build 2>&1 | tail -2
pm2 restart promptopia 2>/dev/null
echo "OK"
'`, (e2, s2) => {
        let o = "";
        s2.on("data", (d) => o += d.toString());
        s2.stderr.on("data", (d) => o += d.toString());
        s2.on("close", () => { console.log(o.slice(-500)); c.end(); });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
