// upload-one.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const f = "src/app/category/[slug]/page.tsx";
const b64 = readFileSync(`promptopia-web/${f}`, "base64");

c.on("ready", () => {
  c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/${f} > /dev/null`, (e, s) => {
    let o = "";
    s.on("close", () => {
      console.log(`✅ ${f}`);
      // Now upload tag page
      const b64tag = readFileSync("promptopia-web/src/app/tag/[slug]/page.tsx", "base64");
      c.exec(`echo ${b64tag} | base64 -d | sudo tee /root/promptopia-web/src/app/tag/\\[slug\\]/page.tsx > /dev/null`, (e2, s2) => {
        let o2 = "";
        s2.on("close", () => {
          console.log("✅ tag page");
          // Upload case page
          const b64case = readFileSync("promptopia-web/src/app/case/[slug]/page.tsx", "base64");
          c.exec(`echo ${b64case} | base64 -d | sudo tee /root/promptopia-web/src/app/case/\\[slug\\]/page.tsx > /dev/null`, (e3, s3) => {
            let o3 = "";
            s3.on("close", () => {
              console.log("✅ case page\nRebuilding...");
              c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e4, s4) => {
                let o4 = "";
                s4.on("data", (d) => o4 += d.toString());
                s4.on("close", () => {
                  console.log(o4.slice(-200));
                  setTimeout(() => {
                    c.exec(`curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000`, (e5, s5) => {
                      let o5 = "";
                      s5.on("data", (d) => o5 += d.toString());
                      s5.on("close", () => { console.log("HTTP:", o5); c.end(); });
                    });
                  }, 8000);
                });
              });
            });
          });
        });
      });
    });
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
