// step3-pg.mjs — fix pg auth
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Find pg_hba.conf
HBA=$(find /etc/postgresql -name pg_hba.conf 2>/dev/null | head -1)
echo "HBA: $HBA"

# Change peer/scram to md5 for local connections
sed -i "s/local\\s*all\\s*all\\s*peer/local   all             all                                     md5/" "$HBA"
sed -i "s/local\\s*all\\s*all\\s*scram-sha-256/local   all             all                                     md5/" "$HBA"
sed -i "s/127.0.0.1\\/32\\s*scram-sha-256/127.0.0.1\\/32            md5/" "$HBA"
sed -i "s/::1\\/128\\s*scram-sha-256/::1\\/128               md5/" "$HBA"

# Set password for postgres user
systemctl restart postgresql
sleep 2
su - postgres -c "psql -c \\"ALTER USER postgres WITH PASSWORD \\\\\\"postgres\\\\\\";\\"" 2>&1

# Test connection
PGPASSWORD=postgres psql -h localhost -U postgres -d promptopia -c "SELECT 1 AS connected" 2>&1

echo "AUTH_DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("connected") || o.includes("1 row")) console.log("✅ Auth fixed");
      else console.log("⚠️ Check");
      c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
