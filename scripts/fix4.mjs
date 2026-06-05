// fix4.mjs — upload via base64 + rebuild
import { Client } from "ssh2";
import { readFileSync } from "fs";

const conn = new Client();
const HOST = "150.109.70.58";
const b64 = readFileSync("promptopia-web/src/app/tag/[slug]/page.tsx", "base64");

conn.on("ready", () => {
  console.log("✅ SSH");
  conn.exec(
    `echo ${b64} | base64 -d > /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx && cd /root/promptopia-web && npm run build 2>&1 | tail -5`,
    (err, stream) => {
      let o = "";
      stream.on("data", (d) => o += d.toString());
      stream.stderr.on("data", (d) => o += d.toString());
      stream.on("close", (code) => {
        console.log(o.slice(-800));
        if (code === 0) {
          conn.exec("pm2 restart promptopia", () => {
            console.log("✅ Deployed!");
            conn.end();
          });
        } else {
          console.log("❌ Build failed");
          conn.end();
        }
      });
    }
  );
});

conn.connect({ host: HOST, port: 22, username: "root", password: "Mmzzss060112" });
