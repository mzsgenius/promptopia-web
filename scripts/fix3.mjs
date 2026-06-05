// fix3.mjs — upload fixed file via heredoc and rebuild
import { Client } from "ssh2";
import { readFileSync } from "fs";

const conn = new Client();
const HOST = "150.109.70.58";
const content = readFileSync("promptopia-web/src/app/tag/[slug]/page.tsx", "utf-8")
  .replace(/\$/g, "\\$").replace(/`/g, "\\`");

conn.on("ready", () => {
  console.log("✅ SSH");
  // Write via cat heredoc
  conn.exec(`cat > /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx << 'FILEEOF'
${content}
FILEEOF`, (err, stream) => {
    let o = "";
    stream.on("close", (code) => {
      console.log(`Write: exit ${code}`);
      // Rebuild
      conn.exec("cd /root/promptopia-web && npm run build 2>&1 | tail -5", (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.stderr.on("data", (d) => o2 += d.toString());
        s2.on("close", (code2) => {
          console.log(o2);
          if (code2 === 0) {
            console.log("✅ Build OK!");
            conn.exec("pm2 restart promptopia", () => { conn.end(); });
          } else {
            console.log("❌ Build failed");
            conn.end();
          }
        });
      });
    });
    stream.on("data", (d) => o += d.toString());
    stream.stderr.on("data", (d) => o += d.toString());
  });
});

conn.connect({ host: HOST, port: 22, username: "root", password: "Mmzzss060112" });
