// domain-setup.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Update Nginx config with domain
cat > /etc/nginx/sites-available/default << "EOF"
server {
    listen 80;
    server_name promptopia.cn www.promptopia.cn;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;
    gzip_comp_level 5;
    gzip_proxied any;

    location = /baidu_verify_codeva-7lXDrQN2eL.html {
        root /var/www/html;
    }

    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 301 302 365d;
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

nginx -t && systemctl reload nginx
echo "NGINX_OK"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
