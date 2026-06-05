// nginx-optimize.mjs — better caching for performance
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cat > /etc/nginx/sites-available/default << "EOF"
server {
    listen 80;
    server_name _;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;
    gzip_comp_level 5;
    gzip_proxied any;

    # Baidu verification
    location = /baidu_verify_codeva-7lXDrQN2eL.html {
        root /var/www/html;
    }

    # Static assets - cache for 1 year
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache STATIC;
        proxy_cache_valid 200 301 302 365d;
        add_header Cache-Control "public, immutable";
        expires 365d;
    }

    # Case pages - cache for 1 hour (content rarely changes)
    location ~* ^/case/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache PAGE;
        proxy_cache_valid 200 1h;
        proxy_cache_use_stale error timeout updating;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Everything else
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_buffering on;
        proxy_buffer_size 8k;
        proxy_buffers 8 32k;
    }
}
EOF

# Create cache zones
mkdir -p /var/cache/nginx
cat > /etc/nginx/conf.d/cache.conf << "CEOF"
proxy_cache_path /var/cache/nginx/static levels=1:2 keys_zone=STATIC:10m max_size=100m inactive=30d;
proxy_cache_path /var/cache/nginx/page levels=1:2 keys_zone=PAGE:10m max_size=200m inactive=7d;
CEOF

nginx -t && systemctl reload nginx
echo "NGINX_OK"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-200)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
