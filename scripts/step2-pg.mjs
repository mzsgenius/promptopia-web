// step2-pg.mjs — setup db + push schema
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
systemctl restart postgresql 2>/dev/null
sleep 2
su - postgres -c "psql -c \\"CREATE DATABASE promptopia OWNER postgres;\\"" 2>/dev/null || true
echo "DB_READY"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("DB_READY")) {
        // Push schema
        c.exec(`echo Mmzzss060112 | sudo -S DATABASE_URL="postgresql://postgres@localhost:5432/promptopia" bash -c 'cd /root/promptopia-web && npx prisma db push --accept-data-loss 2>&1 | tail -5'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            console.log(o2);
            if (o2.includes("created") || o2.includes("already")) console.log("✅ Tables ready");
            c.end();
          });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
