// fix2.mjs — check full error and fix properly
import { Client } from "ssh2";
const conn = new Client();
const cmds = [
  // Get full build error
  `cd /root/promptopia-web && npm run build 2>&1 | grep -A5 "Type error"`,
  // Check the actual file content around the error
  `sed -n '88,96p' /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx`,
];

conn.on("ready", () => {
  function run(i) {
    if (i >= cmds.length) { conn.end(); return; }
    console.log(`\n▶ ${cmds[i].slice(0, 60)}`);
    conn.exec(cmds[i], (err, stream) => {
      let out = "";
      stream.on("close", () => { console.log(out); run(i + 1); });
      stream.on("data", (d) => { out += d.toString(); });
      stream.stderr.on("data", (d) => { out += d.toString(); });
    });
  }
  run(0);
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
