// upload-cat.mjs
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const b64 = readFileSync("promptopia-web/src/app/category/[slug]/page.tsx", "base64");
c.on("ready", () => {
  c.exec(`echo ${b64} | base64 -d | sudo tee /root/promptopia-web/src/app/category/\\[slug\\]/page.tsx > /dev/null && echo OK`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
