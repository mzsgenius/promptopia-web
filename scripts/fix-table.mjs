// fix-table.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "f='/root/promptopia-web/src/app/case/[slug]/page.tsx';c=open(f).read();old='color:#60a5fa\\\"}} />';newcss='.prose table{width:100%;border-collapse:collapse;margin-bottom:1rem}.prose th,.prose td{border:1px solid #d1d5db;padding:0.5rem 0.75rem;text-align:left}.dark .prose th,.dark .prose td{border-color:#4b5563}.prose th{background:#f9fafb;font-weight:500}.dark .prose th{background:#1f2937}';c=c.replace(old,old.replace('\\\"}} />',newcss+'\\\"}} />'));open(f,'w').write(c);print('OK' if old in c else 'DONE')"`, (e, s) => {
    let o = "";
    s.on("close", () => { console.log(o || "no output"); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
