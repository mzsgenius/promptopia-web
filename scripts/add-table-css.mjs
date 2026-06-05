// add-table-css.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd "/root/promptopia-web/src/app/case/[slug]"
# Append table CSS to the existing style string
sed -i "s|color:#60a5fa}\\"\\"}}|color:#60a5fa}.prose table{width:100%;border-collapse:collapse;margin-bottom:1rem}.prose th,.prose td{border:1px solid #d1d5db;padding:0.5rem 0.75rem;text-align:left}.dark .prose th,.dark .prose td{border-color:#4b5563}.prose th{background:#f9fafb;font-weight:500}.dark .prose th{background:#1f2937}\\"\\"}}|" page.tsx
grep -c "border-collapse" page.tsx
echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("DONE")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILT'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
