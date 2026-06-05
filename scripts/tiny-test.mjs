// tiny-test.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  // Send just 100 bytes via stdin
  const data = "A".repeat(100);
  const b64 = Buffer.from(data).toString("base64");
  c.exec(`base64 -d > /tmp/test.txt && wc -c < /tmp/test.txt`, (e, stream) => {
    if (e) { console.log("ERR:", e.message); c.end(); return; }
    stream.on("close", () => { console.log("Connected and wrote data"); c.end(); });
    stream.stdin.end(b64);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
