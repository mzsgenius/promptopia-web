// upload-simple.mjs
import { Client } from "ssh2";
import { readFileSync, writeFileSync } from "fs";
const c = new Client();

const files = [
  ["src/components/case/md-editor.tsx", "md-editor.tsx"],
  ["src/components/case/md-renderer.tsx", "md-renderer.tsx"],
  ["src/components/shared/copy-button.tsx", "copy-button.tsx"],
  ["src/app/api/case/upload/route.ts", "upload-route.ts"],
  ["src/app/case/new/page.tsx", "case-new-page.tsx"],
  ["src/app/globals.css", "globals.css"],
  ["src/app/case/[slug]/page.tsx", "case-slug-page.tsx"],
];

// Write all files to /tmp locally first
for (const [local, tmpName] of files) {
  const content = readFileSync(`promptopia-web/${local}`, "utf-8");
  writeFileSync(`/tmp/${tmpName}`, content);
}

c.on("ready", () => {
  console.log("✅ SSH\n");
  let i = 0;
  function next() {
    if (i >= files.length) {
      console.log("Building...");
      c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e, s) => {
        let o = "";
        s.on("data", (d) => o += d.toString());
        s.on("close", () => { console.log(o.slice(-300)); c.end(); });
      });
      return;
    }
    const [local, tmpName] = files[i];
    // Target path
    const target = `/root/promptopia-web/${local.replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]')}`;
    c.exec(`cat /tmp/${tmpName} | echo Mmzzss060112 | sudo -S tee ${target} > /dev/null`, (e, s) => {
      let o = "";
      s.on("close", () => {
        console.log(`  ${local.split("/").pop()}: ✅`);
        i++;
        next();
      });
      s.on("data", (d) => o += d.toString());
    });
  }
  next();
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
