// add-inline-styles.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd "/root/promptopia-web/src/app/case/[slug]"

# Add inline style tag before the article tag
sed -i "s|<article class=\"prose|<style>.prose h2{font-size:1.5rem;font-weight:700;margin-top:2rem;margin-bottom:.75rem}.prose h3{font-size:1.25rem;font-weight:600;margin-top:1.5rem;margin-bottom:.5rem}.prose p{margin-bottom:.75rem;line-height:1.7}.prose ul{list-style:disc;padding-left:1.5rem;margin-bottom:.75rem}.prose ol{list-style:decimal;padding-left:1.5rem;margin-bottom:.75rem}.prose li{margin-bottom:.25rem}.prose pre{background:#f6f8fa;border:1px solid #e5e7eb;border-radius:.75rem;padding:1rem;overflow-x:auto;margin-bottom:1rem;font-size:.875rem;line-height:1.6}.dark .prose pre{background:#0d1117;border-color:#30363d}.prose code{font-family:var(--font-geist-mono,monospace);font-size:.875em}.prose pre code{background:0;border:0;padding:0}.prose blockquote{border-left:4px solid #d1d5db;padding-left:1rem;margin-bottom:.75rem;color:#6b7280;font-style:italic}.dark .prose blockquote{border-color:#4b5563;color:#9ca3af}.prose a{color:#2563eb;text-decoration:underline}.dark .prose a{color:#60a5fa}</style>\\n      <article class=\"prose|" page.tsx

grep -c "prose h2" page.tsx
echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("DONE")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-300)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
