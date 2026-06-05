// fix-with-sed.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
sed -i "s/text-sm text-muted-foreground hover:underline mb-4 inline-block/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/g" "/root/promptopia-web/src/app/category/[slug]/page.tsx"
sed -i "s/text-sm text-muted-foreground hover:underline mb-4 inline-block/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/g" "/root/promptopia-web/src/app/tag/[slug]/page.tsx"
sed -i "s/text-sm text-muted-foreground hover:underline mb-4 inline-block/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/g" "/root/promptopia-web/src/app/case/[slug]/page.tsx"
echo "SED_DONE"
grep "font-medium text-primary" "/root/promptopia-web/src/app/category/[slug]/page.tsx" | head -1
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
