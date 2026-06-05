import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();
const art = readFileSync("promptopia-web/scripts/articles/ai-siweidaotu.md", "utf-8");
const scr = readFileSync("promptopia-web/scripts/import-siweidaotu.cjs", "utf-8");

c.on("ready", () => {
  c.sftp((err, sftp) => {
    if (err) { console.error(err); c.end(); return; }
    const ws1 = sftp.createWriteStream("/tmp/art-siweidaotu.md");
    ws1.end(art);
    ws1.on("close", () => {
      const ws2 = sftp.createWriteStream("/tmp/imp-siweidaotu.cjs");
      ws2.end(scr);
      ws2.on("close", () => {
        sftp.end();
        c.exec(`echo Mmzzss060112 | sudo -S NODE_PATH=/root/promptopia-web/node_modules node /tmp/imp-siweidaotu.cjs`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2); c.end(); });
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
