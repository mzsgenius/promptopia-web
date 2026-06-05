// pg-query.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web
node -e "const {Pool}=require(\\\"pg\\\");new Pool({connectionString:\\\"postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres\\\"}).query(\\\"SELECT category, COUNT(*) as c FROM \\\\\\\"Case\\\\\\\" GROUP BY category ORDER BY c DESC\\\").then(r=>r.rows.forEach(x=>console.log(x.category+\\\": \\\"+x.c))).catch(e=>console.log(e.message))"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
