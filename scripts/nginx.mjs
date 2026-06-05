// nginx-setup.mjs — install nginx + proxy to localhost:3000
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
apt-get install -y nginx

cat > /etc/nginx/sites-available/default << "EOF"
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

nginx -t && systemctl restart nginx
echo "NGINX_DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-400)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
