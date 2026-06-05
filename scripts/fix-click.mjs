// fix-click.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
# Replace the back link style with a proper clickable button
sed -i "s/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/text-sm px-3 py-1.5 rounded-md bg-primary\\/10 text-primary hover:bg-primary\\/20 mb-4 inline-block w-fit/g" "/root/promptopia-web/src/app/category/[slug]/page.tsx"
sed -i "s/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/text-sm px-3 py-1.5 rounded-md bg-primary\\/10 text-primary hover:bg-primary\\/20 mb-4 inline-block w-fit/g" "/root/promptopia-web/src/app/tag/[slug]/page.tsx"
sed -i "s/text-sm font-medium text-primary hover:text-primary\\/80 mb-4 inline-flex items-center gap-1/text-sm px-3 py-1.5 rounded-md bg-primary\\/10 text-primary hover:bg-primary\\/20 mb-4 inline-block w-fit/g" "/root/promptopia-web/src/app/case/[slug]/page.tsx"
grep "px-3 py-1.5" "/root/promptopia-web/src/app/category/[slug]/page.tsx" | head -1
echo "DONE"
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
