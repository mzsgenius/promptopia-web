// deploy.mjs — SSH into Tencent Cloud server and deploy PrompTopia
import { Client } from "ssh2";

const HOST = "150.109.70.58";
const PORT = 22;
const USER = "root";
const PASS = "Mmzzss060112";

const commands = [
  // Install Node.js 20
  `curl -fsSL https://deb.nodesource.com/setup_20.x | bash -`,
  `apt-get install -y nodejs`,
  `node -v`,

  // Install PM2
  `npm install -g pm2`,

  // Clone repo (remove if exists)
  `cd /root && rm -rf promptopia-web && git clone https://github.com/mzsgenius/promptopia-web.git`,
  `cd /root/promptopia-web`,

  // Create .env
  `cat > /root/promptopia-web/.env << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://150.109.70.58"
ENVEOF`,

  // Install deps + build + start
  `cd /root/promptopia-web && npm install`,
  `cd /root/promptopia-web && npx prisma generate`,
  `cd /root/promptopia-web && npm run build`,
  `pm2 delete promptopia 2>/dev/null; cd /root/promptopia-web && PORT=3000 pm2 start npm --name "promptopia" -- start`,
  `pm2 save`,
];

const conn = new Client();

conn.on("ready", () => {
  console.log("✅ SSH connected");

  function run(i) {
    if (i >= commands.length) {
      console.log("\n✅ 全部命令执行完成！");
      console.log("   http://150.109.70.58");
      conn.end();
      return;
    }
    const cmd = commands[i];
    console.log(`\n▶ [${i + 1}/${commands.length}] $ ${cmd.slice(0, 80)}...`);
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error(`❌ ${err.message}`);
        conn.end();
        return;
      }
      let output = "";
      stream
        .on("close", (code) => {
          if (code !== 0) {
            console.log(`   ⚠️ exit code: ${code}`);
          }
          console.log(output.slice(-500)); // last 500 chars
          run(i + 1);
        })
        .on("data", (data) => { output += data.toString(); })
        .stderr.on("data", (data) => { output += data.toString(); });
    });
  }

  run(0);
});

conn.connect({
  host: HOST,
  port: PORT,
  username: USER,
  password: PASS,
  readyTimeout: 10000,
});

console.log(`🔌 Connecting to ${HOST}...`);
