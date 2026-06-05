// upload-single-file.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Upload one file at a time, simplest method
const B = s => Buffer.from(s).toString("base64");
const content = readFileSync("promptopia-web/src/components/case/md-renderer.tsx", "utf-8");
const b64 = B(content);

c.on("ready", () => {
  console.log(`Uploading md-renderer.tsx (${b64.length} chars b64)...`);
  // Use python stdin approach
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "import base64,sys; open('/root/promptopia-web/src/components/case/md-renderer.tsx','wb').write(base64.b64decode(sys.stdin.read())); print('OK')"`, (e, stream) => {
    if (e || !stream) { console.error("ERR:", e?.message); c.end(); return; }
    let o = "";
    stream.on("data", (d) => o += d.toString());
    stream.on("close", () => { console.log("Result:", o.trim()); c.end(); });
    stream.stdin.end(b64);
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
