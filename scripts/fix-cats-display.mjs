// fix-cats-display.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
f='/root/promptopia-web/src/app/page.tsx'
c=open(f).read()
# Fix the category display section: change from horizontal scroll to grid
old_grid='<div className=\"flex gap-2 overflow-x-auto pb-1 scrollbar-none\">'
new_grid='<div className=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">'
if old_grid in c:
    c=c.replace(old_grid, new_grid)
    open(f,'w').write(c)
    print('FIXED')
else:
    print('NOT_FOUND')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o);
      if (o.includes("FIXED")) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => { console.log(o2.slice(-200)); c.end(); });
        });
      } else c.end();
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
