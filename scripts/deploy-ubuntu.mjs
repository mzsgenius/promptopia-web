// deploy-ubuntu.mjs — full deploy on Ubuntu via ubuntu user + sudo
import { Client } from "ssh2";
const c = new Client();

const cmds = [
  // Step 1: Switch to root
  `echo 'Mmzzss060112' | sudo -S su -c 'echo "root ok"'`,
  // Step 2: Install deps as root via sudo
  `echo 'Mmzzss060112' | sudo -S bash -c '
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git
npm install -g pm2
npm install -g npm@latest
'`,
  // Step 3: Clone repo
  `echo 'Mmzzss060112' | sudo -S rm -rf /root/promptopia-web`,
  `echo 'Mmzzss060112' | sudo -S git clone https://github.com/mzsgenius/promptopia-web.git /root/promptopia-web`,
  // Step 4: Create .env
  `echo 'Mmzzss060112' | sudo -S bash -c 'cat > /root/promptopia-web/.env << EOF
NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://150.109.70.58"
NEXT_PUBLIC_SITE_URL2="http://150.109.70.58:3000"
EOF'`,
  // Step 5: Install + build
  `echo 'Mmzzss060112' | sudo -S bash -c 'cd /root/promptopia-web && npm install 2>&1 | tail -3'`,
  `echo 'Mmzzss060112' | sudo -S bash -c 'cd /root/promptopia-web && npx prisma generate 2>&1 | tail -2'`,
  `echo 'Mmzzss060112' | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -5'`,
  // Step 6: Start
  `echo 'Mmzzss060112' | sudo -S bash -c 'cd /root/promptopia-web && PORT=3000 node node_modules/.bin/next start -p 3000 > /tmp/prom.log 2>&1 &'`,
  `sleep 8`,
  // Step 7: Verify
  `curl -s --max-time 5 -o /dev/null -w "HTTP: %{http_code}\\n" http://localhost:3000 2>&1`,
];

let step = 0;
c.on("ready", () => {
  console.log("✅ SSH as ubuntu");
  run();
  function run() {
    if (step >= cmds.length) { console.log("\n✅ Done"); c.end(); return; }
    console.log(`\n[${step + 1}/${cmds.length}]`);
    c.exec(cmds[step], (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.stderr.on("data", (d) => o += d.toString());
      s.on("close", (code) => {
        if (o.length > 300) o = "..." + o.slice(-300);
        console.log(o);
        step++; run();
      });
    });
  }
});

c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
console.log("🔌 Connecting as ubuntu...");
