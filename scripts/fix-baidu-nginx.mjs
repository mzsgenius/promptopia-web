// fix-baidu-nginx.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "901ee9128a151840d31e0a88fd674249" > /var/www/html/baidu_verify_codeva-MudQJQfD6f.html

# Fix nginx config
cat > /etc/nginx/sites-available/default << "EOF"
server {
    listen 80;
    server_name promptopia.cn www.promptopia.cn;

    gzip on;
    gzip_types text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;
    gzip_comp_level 5;

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
        expires 365d;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering on;
    }
}
EOF

# Baidu verification files in /var/www/html
sed -i 's|location /_next/static|location = /baidu_verify_codeva-MudQJQfD6f.html { root /var/www/html; }\\n\\n    location = /baidu_verify_codeva-7lXDrQN2eL.html { root /var/www/html; }\\n\\n    location /_next/static|' /etc/nginx/sites-available/default

nginx -t && systemctl reload nginx
curl -s http://127.0.0.1/baidu_verify_codeva-MudQJQfD6f.html
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-200)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
