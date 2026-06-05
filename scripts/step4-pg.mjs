// step4-pg.mjs — fix password via SQL file
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
echo "ALTER USER postgres WITH PASSWORD '"'"'postgres'"'"';" | su - postgres -c "psql -f -" 2>&1
PGPASSWORD=postgres psql -h localhost -U postgres -d promptopia -c "SELECT 1 AS connected" 2>&1
echo "OK"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("connected") || o.includes("1 row")) {
        console.log("✅ PG auth works! Now push schema...");
        c.exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && npx prisma db push --accept-data-loss 2>&1 | tail -5'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
