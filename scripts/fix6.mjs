// fix6.mjs — fresh clone + build
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  console.log("✅ SSH");
  conn.exec(`rm -rf /root/promptopia-web && git clone https://github.com/mzsgenius/promptopia-web.git /root/promptopia-web && cd /root/promptopia-web && cat > .env << 'ENVEOF'
NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@db.rqlyuxjttfjndkmafypm.supabase.co:5432/postgres"
NEXT_PUBLIC_SITE_URL="http://150.109.70.58"
ENVEOF
`, (e1, s1) => {
    let o1 = "";
    s1.on("close", (c1) => {
      console.log(o1.slice(-300));
      if (c1 !== 0) { console.log("❌ Clone failed"); conn.end(); return; }

      // Apply fix + build
      conn.exec(`cd /root/promptopia-web && sed -i 's/key={c.id}/key={c.id as string}/' src/app/tag/\\[slug\\]/page.tsx && npm install 2>&1 | tail -1 && npx prisma generate 2>&1 | tail -1 && npm run build 2>&1 | tail -3`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.stderr.on("data", (d) => o2 += d.toString());
        s2.on("close", (c2) => {
          console.log(o2.slice(-500));
          if (c2 === 0) {
            conn.exec("pm2 restart promptopia && sleep 3 && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000", (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => { console.log(`\n🚀 http://150.109.70.58 → HTTP ${o3}`); conn.end(); });
            });
          } else {
            console.log("❌ Build failed");
            conn.end();
          }
        });
      });
    });
    s1.on("data", (d) => o1 += d.toString());
    s1.stderr.on("data", (d) => o1 += d.toString());
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
