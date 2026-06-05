// simple-sudo.mjs — single sudo write
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const content = readFileSync("promptopia-web/src/app/layout.tsx", "utf-8");
const escaped = content.replace(/'/g, "'\\''");

c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cat > /root/promptopia-web/src/app/layout.tsx << HEREDOC
${escaped}
HEREDOC
echo "WRITTEN"
grep baidu /root/promptopia-web/src/app/layout.tsx
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", (code) => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
