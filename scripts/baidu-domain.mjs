// baidu-domain.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo '901ee9128a151840d31e0a88fd674249' | sudo tee /var/www/html/baidu_verify_codeva-MudQJQfD6f.html > /dev/null
# Update nginx to serve all baidu verify files via location regex
sed -i 's|location = /baidu_verify_codeva-7lXDrQN2eL.html|location ~ ^/baidu_verify_|' /etc/nginx/sites-available/default
nginx -t && systemctl reload nginx 2>/dev/null && echo OK`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      if (o.includes("OK")) {
        console.log("✅ 验证文件已上传");
        // Test
        c.exec(`curl -s http://127.0.0.1/baidu_verify_codeva-MudQJQfD6f.html`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log("内容:", o2); c.end(); });
        });
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
