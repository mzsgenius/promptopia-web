// fix-pg2.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Fix PostgreSQL password
su - postgres -c "psql -c \\"ALTER USER postgres WITH PASSWORD \\\\\"postgres\\\\\\";\\"" 2>&1

# Test connection
PGPASSWORD=postgres psql -h localhost -U postgres -d promptopia -c "SELECT 1 as ok" 2>&1

# Push schema
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptopia" npx --prefix /root/promptopia-web prisma db push --accept-data-loss 2>&1 | tail -3

echo "STEP_DONE"
'`, async (e, s) => {
    let o = "";
    for await (const chunk of s) o += chunk.toString();
    console.log(o);
    c.end();
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
