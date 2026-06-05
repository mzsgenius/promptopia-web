// browse-server.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "=== /root/promptopia-web 目录 ==="
ls -lah /root/promptopia-web/
echo ""
echo "=== src/app/ 页面结构 ==="
ls -R /root/promptopia-web/src/app/ | head -40
echo ""
echo "=== 数据库统计 ==="
psql postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres -c "SELECT count(*) as cases FROM \\\"Case\\\"" -t 2>/dev/null
psql postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres -c "SELECT count(*) as users FROM \\\"User\\\"" -t 2>/dev/null
echo ""
echo "=== Nginx 状态 ==="
systemctl status nginx --no-pager | head -3
echo ""
echo "=== PM2 进程 ==="
pm2 status 2>/dev/null | head -5
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
