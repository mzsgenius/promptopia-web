// finalize.mjs — PM2 save + test public access
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo 'Mmzzss060112' | sudo -S bash -c '
cd /root/promptopia-web
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null
# Test public endpoints
echo "---PUBLIC---"
curl -s -o /dev/null -w "public: %{http_code}\\n" http://150.109.70.58:3000
curl -s -o /dev/null -w "api: %{http_code}\\n" http://150.109.70.58:3000/api/case/list?page=1
curl -s -o /dev/null -w "search: %{http_code}\\n" "http://150.109.70.58:3000/api/case/search?q=ChatGPT"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
