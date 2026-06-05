// quick-fix.mjs
import { Client } from "ssh2";
const c = new Client();
const content = `import { MarkdownRenderer } from "@/components/case/md-renderer";`;
const tmpName = `check_md.tsx`;

c.on("ready", () => {
  // Write a tiny test file first to verify the approach works
  c.exec(`echo 'import { MarkdownRenderer } from "x";' > /tmp/${tmpName} && wc -c < /tmp/${tmpName}`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log("Test write:", o.trim(), "bytes");
      
      // Now download from GitHub raw
      c.exec(`curl -sL "https://raw.githubusercontent.com/mzsgenius/promptopia-web/main/src/app/case/%5Bslug%5D/page.tsx" -o /tmp/gh_page.tsx && wc -c < /tmp/gh_page.tsx`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => {
          const bytes = parseInt(o2.trim());
          console.log("GitHub download:", bytes, "bytes");
          
          if (bytes > 1000) {
            // Move to target
            c.exec(`echo Mmzzss060112 | sudo -S mv /tmp/gh_page.tsx "/root/promptopia-web/src/app/case/[slug]/page.tsx" && echo OK`, (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => {
                if (o3.includes("OK")) {
                  console.log("✅ File replaced from GitHub");
                  c.exec(`echo Mmzzss060112 | sudo -S grep "MarkdownRenderer" "/root/promptopia-web/src/app/case/[slug]/page.tsx"`, (e4, s4) => {
                    let o4 = "";
                    s4.on("data", (d) => o4 += d.toString());
                    s4.on("close", () => {
                      console.log("Has MarkdownRenderer:", o4.includes("MarkdownRenderer"));
                      if (o4.includes("MarkdownRenderer")) {
                        // Build and restart
                        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILD_DONE'`, (e5, s5) => {
                          let o5 = "";
                          s5.on("data", (d) => o5 += d.toString());
                          s5.on("close", () => { console.log(o5.slice(-200)); c.end(); });
                        });
                      } else c.end();
                    });
                  });
                } else c.end();
              });
            });
          } else {
            console.log("❌ Download too small, git push probably not done");
            c.end();
          }
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
