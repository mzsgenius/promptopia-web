// fix-deploy.mjs — rebuild and restart correctly
import { Client } from "ssh2";

const conn = new Client();
const cmds = [
  // Step 1: Check what's happening
  `pm2 logs promptopia --lines 15 --nostream`,

  // Step 2: Remove the problematic seed.ts file
  `rm -f /root/promptopia-web/scripts/seed.ts`,

  // Clean rebuild
  `cd /root/promptopia-web && npm run build 2>&1 | tail -20`,

  // Restart PM2
  `pm2 restart promptopia`,
  `sleep 3`,
  `curl -s -o /dev/null -w "HTTP: %{http_code}\n" http://localhost:3000`,
];

conn.on("ready", () => {
  console.log("✅ SSH\n");

  function run(i) {
    if (i >= cmds.length) { conn.end(); return; }
    const cmd = cmds[i];
    console.log(`\n▶ ${cmd.slice(0, 70)}`);
    conn.exec(cmd, (err, stream) => {
      let out = "";
      stream.on("close", () => { console.log(out.slice(-800)); run(i + 1); });
      stream.on("data", (d) => { out += d.toString(); });
      stream.stderr.on("data", (d) => { out += d.toString(); });
    });
  }
  run(0);
});

conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
