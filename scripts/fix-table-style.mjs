// fix-table-style.mjs
import { Client } from "ssh2";
const c = new Client();

c.on("ready", () => {
  // First check what the inline style currently contains
  c.exec(`echo Mmzzss060112 | sudo -S grep "<style>" "/root/promptopia-web/src/app/case/[slug]/page.tsx" | head -c 200`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      const currentStyle = o.trim();
      console.log("Current style tag:", currentStyle.slice(0, 100) + "...");
      
      // We need to add table styles. The simplest fix: add CSS to the globals.css
      // or add to the inline style in the detail page
      // Let me check if we can just add table styles to the existing inline style
      
      c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd "/root/promptopia-web/src/app/case/[slug]"
# Add table styles to the inline style tag
# The existing style tag was inserted before className="prose
# We need to append table styles
sed -i "s|</style>|.prose table{width:100%\\;border-collapse:collapse\\;margin-bottom:1rem}.prose th,.prose td{border:1px solid #e5e7eb\\;padding:.5rem .75rem\\;text-align:left}.dark .prose th,.dark .prose td{border-color:#374151}.prose th{background:#f9fafb\\;font-weight:500}.dark .prose th{background:#1f2937}</style>|" page.tsx
echo DONE
'`, (e2, s2) => {
        let o2 = "";
        s2.on("data", (d) => o2 += d.toString());
        s2.on("close", () => {
          console.log(o2);
          if (o2.includes("DONE")) {
            c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo BUILT'`, (e3, s3) => {
              let o3 = "";
              s3.on("data", (d) => o3 += d.toString());
              s3.on("close", () => { console.log(o3.slice(-200)); c.end(); });
            });
          } else c.end();
        });
      });
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
