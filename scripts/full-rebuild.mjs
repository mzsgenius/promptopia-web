// full-rebuild.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  // Check if the page exists
  c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -10 && pm2 restart promptopia && echo DONE'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      setTimeout(async () => {
        // Test the page
        c.exec(`curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/case/doubao-xianyu-2500`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log("HTTP:", o2); c.end(); });
        });
      }, 5000);
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
