// fresh-start.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  const cmds = `
# Aggressively kill everything on port 3000
fuser -k 3000/tcp 2>/dev/null
sleep 2

# Remove any stale PM2 configs
pm2 kill 2>/dev/null
sleep 1

# Start fresh with full env
cd /root/promptopia-web
export PORT=3000
export NEXT_PUBLIC_SUPABASE_URL="https://rqlyuxjttfjndkmafypm.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxbHl1eGp0dGZqbmRrbWFmeXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzMzODYsImV4cCI6MjA5NjA0OTM4Nn0.xqjE1PYWb9INXMdVTOy_MmBL-qLhtQgxONVnLfcn11s"
export DATABASE_URL="postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# Try running directly
npx next start -p 3000 > /tmp/next-output.log 2>&1 &
NEXT_PID=$!
echo "Started PID=$NEXT_PID"

# Wait and check
sleep 10
echo "--- SS ---"
ss -tlnp | grep 3000
echo "--- CURL ---"
curl -s --max-time 5 -o /dev/null -w "HTTP_CODE:%{http_code}\\n" http://localhost:3000 2>&1
echo "--- LOG ---"
cat /tmp/next-output.log
  `.trim();
  c.exec(cmds, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
