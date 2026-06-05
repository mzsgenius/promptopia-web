// fix-server.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Start PostgreSQL properly
pg_ctlcluster 14 main start 2>&1 || service postgresql@14-main start 2>&1
sleep 2
# Verify PG is running
su - postgres -c "psql -c \\"SELECT 1\\"" 2>&1
echo "PG_OK=$?"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
