// upload-v6.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

const files = [
  "src/app/case/[slug]/page.tsx",
];

c.on("ready", () => {
  console.log("✅ SSH");
  const f = files[0];
  const content = readFileSync(`promptopia-web/${f}`, "utf-8");
  const escaped = content.replace(/'/g, "'\\''");
  const target = f.replace(/\[/g, '\\[').replace(/\]/g, '\\]');

  c.exec(`echo Mmzzss060112 | sudo -S bash << 'BASH_SCRIPT'
cat > /root/promptopia-web/${target} << 'FILEEOF'
${content}
FILEEOF
echo "WRITTEN"
BASH_SCRIPT`, (e, s) => {
    let o = "";
    s.on("close", () => {
      console.log(o.slice(-200));
      if (o.includes("WRITTEN")) {
        // Verify
        c.exec(`echo Mmzzss060112 | sudo -S grep "MarkdownRenderer" "/root/promptopia-web/src/app/case/[slug]/page.tsx"`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log("Has MarkdownRenderer:", o2.includes("MarkdownRenderer")); c.end(); });
        });
      } else c.end();
    });
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
