// prod.mjs — stop default, start PrompTopia
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  console.log("✅ SSH");

  conn.exec(`
# Stop the default Tencent app
systemctl stop myapp
systemctl disable myapp
sleep 1

# Kill whatever is on port 80
kill -9 $(lsof -ti:80) 2>/dev/null
sleep 1

# Set up PM2 to run PrompTopia on port 80
cd /root/promptopia-web
pm2 delete promptopia 2>/dev/null
NODE_ENV=production PORT=80 pm2 start node_modules/.bin/next --name "promptopia" -- start -p 80
sleep 4

# Test
curl -s -o /dev/null -w "%{http_code}" http://localhost:80
  `.trim(), (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", (code) => {
      console.log(o);
      if (o.includes("200")) {
        console.log("\n✅ http://150.109.70.58 已上线！");
        // Verify with actual content
        conn.exec(`curl -s http://localhost:80 | grep -o '<title>[^<]*</title>'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            console.log(`   ${o2}`);
            // Save PM2 config for auto-restart
            conn.exec("pm2 save && pm2 startup systemd -u root --hp /root 2>/dev/null", () => {});
            conn.end();
          });
        });
      } else {
        console.log("❌ 部署失败");
        conn.end();
      }
    });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
