// deploy-centos.mjs — SSH deploy for CentOS
import { Client } from "ssh2";

const HOST = "150.109.70.58";
const PORT = 22;
const USER = "root";
const PASS = "Mmzzss060112";

const commands = [
  // Step 1: Check OS
  `cat /etc/os-release | head -5`,

  // Step 2: Install Node.js 20 (CentOS)
  `curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -`,
  `yum install -y nodejs`,
  `node -v`,
  `npm -v`,

  // Step 3: Install PM2
  `npm install -g pm2`,

  // Step 4: Install git if needed
  `yum install -y git`,

  // Step 5: Clone repo
  `cd /root && rm -rf promptopia-web`,
  `git clone https://github.com/mzsgenius/promptopia-web.git`,
  `cd /root/promptopia-web`,

  // Step 6: Create .env
  `cat > /root/promptopia-web/.env << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://150.109.70.58"
ENVEOF`,

  // Step 7: Install deps
  `cd /root/promptopia-web && npm install 2>&1 | tail -5`,

  // Step 8: Prisma generate
  `cd /root/promptopia-web && npx prisma generate 2>&1`,

  // Step 9: Build
  `cd /root/promptopia-web && npm run build 2>&1 | tail -10`,

  // Step 10: Start with PM2
  `pm2 delete promptopia 2>/dev/null; cd /root/promptopia-web && PORT=3000 pm2 start npm --name "promptopia" -- start 2>&1`,
  `pm2 save`,
];

const conn = new Client();

conn.on("ready", () => {
  console.log("✅ SSH connected");

  function run(i) {
    if (i >= commands.length) {
      console.log("\n✅ 部署完成！");
      console.log("   访问: http://150.109.70.58");
      conn.end();
      return;
    }
    const cmd = commands[i];
    console.log(`\n▶ [${i + 1}/${commands.length}] ${cmd.slice(0, 70)}`);
    conn.exec(cmd, (err, stream) => {
      if (err) { console.error(`❌ ${err.message}`); conn.end(); return; }
      let out = "";
      stream
        .on("close", (code) => {
          if (code !== 0) console.log(`   ⚠️ exit: ${code}`);
          console.log(out.slice(-400));
          run(i + 1);
        })
        .on("data", (d) => { out += d.toString(); })
        .stderr.on("data", (d) => { out += d.toString(); });
    });
  }
  run(0);
});

conn.connect({ host: HOST, port: PORT, username: USER, password: PASS });
console.log("🔌 Connecting...");
