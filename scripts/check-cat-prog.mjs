// check-cat-programming.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`curl -s http://127.0.0.1:3000/category/ai-programming 2>&1 | grep -o "暂无相关案例\\|AI编程案例\\|AI副业"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log("Matches:", o || "(none)"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
