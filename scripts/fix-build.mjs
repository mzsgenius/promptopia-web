// fix-build.mjs — fix TS error + rebuild on server
import { Client } from "ssh2";

const conn = new Client();
const cmds = [
  // Fix the type error directly
  `sed -i 's/key={c.id}/key={c.id as string}/' /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx`,

  // Rebuild
  `cd /root/promptopia-web && npm run build 2>&1 | tail -5`,

  // Restart
  `pm2 restart promptopia`,
  `sleep 4`,
  `curl -s -o /dev/null -w "HTTP: %{http_code}\\n" http://localhost:3000`,
];

conn.on("ready", () => {
  function run(i) {
    if (i >= cmds.length) { conn.end(); return; }
    console.log(`\n▶ ${cmds[i].slice(0, 60)}`);
    conn.exec(cmds[i], (err, stream) => {
      let out = "";
      stream.on("close", () => { console.log(out.slice(-500)); run(i + 1); });
      stream.on("data", (d) => { out += d.toString(); });
      stream.stderr.on("data", (d) => { out += d.toString(); });
    });
  }
  run(0);
});

conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
