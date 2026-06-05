// upload-via-python.mjs
import { Client } from "ssh2";
import { readFileSync, writeFileSync } from "fs";
const c = new Client();

const files = [
  "src/components/case/md-editor.tsx",
  "src/components/case/md-renderer.tsx",
  "src/components/shared/copy-button.tsx",
  "src/app/api/case/upload/route.ts",
  "src/app/case/new/page.tsx",
  "src/app/globals.css",
];

// Special handling for [slug] path
const detailPage = "src/app/case/[slug]/page.tsx";

async function uploadPython(path, content) {
  const b64 = Buffer.from(content).toString("base64");
  const tmpName = `tmp_${path.replace(/[\\/\\[\\]]/g, '_')}`;
  return new Promise(resolve => {
    // Write to tmp first (no sudo needed), then sudo mv
    writeFileSync(`/tmp/${tmpName}`, content);
    const p = path.replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]');
    c.exec(`echo Mmzzss060112 | sudo -S mv /tmp/${tmpName} /root/promptopia-web/${p}`, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
  });
}

async function uploadPythonQuote(path, content) {
  const b64 = Buffer.from(content).toString("base64");
  return new Promise(resolve => {
    const stream = c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
import base64, sys
data = base64.b64decode(sys.stdin.read())
open('/root/promptopia-web/${path.replace(/\[/g, '\\\\[').replace(/\]/g, '\\\\]')}', 'wb').write(data)
print('OK')
"`, (e, s) => {
      let o = "";
      s.on("data", (d) => o += d.toString());
      s.on("close", () => resolve(o));
    });
    stream.stdin.end(b64);
  });
}

c.on("ready", async () => {
  console.log("✅ SSH\n");
  
  // Upload regular files with tee
  for (const f of files) {
    const content = readFileSync(`promptopia-web/${f}`, "utf-8");
    const r = await uploadPython(f.replace(/\[/g, '\\[').replace(/\]/g, '\\]'), content);
    console.log(`  ${f.split('/').pop()}: OK`);
  }

  // Upload [slug] file with python (handles brackets better)
  const detailContent = readFileSync(`promptopia-web/${detailPage}`, "utf-8");
  const r = await uploadPythonQuote(detailPage, detailContent);
  console.log(`  page.tsx (detail): ${r.includes('OK') ? 'OK' : 'FAIL'}`);

  // Verify
  c.exec(`echo Mmzzss060112 | sudo -S grep "MarkdownRenderer" "/root/promptopia-web/src/app/case/[slug]/page.tsx"`, (e2, s2) => {
    let o2 = "";
    s2.on("data", (d) => o2 += d.toString());
    s2.on("close", () => {
      const has = o2.includes('MarkdownRenderer');
      console.log(`\nVerification: ${has ? '✅ MarkdownRenderer found' : '❌ NOT FOUND'}`);
      
      if (has) {
        c.exec(`echo Mmzzss060112 | sudo -S bash -c 'cd /root/promptopia-web && npm run build 2>&1 | tail -3 && pm2 restart promptopia && echo DONE'`, (e3, s3) => {
          let o3 = "";
          s3.on("data", (d) => o3 += d.toString());
          s3.on("close", () => { console.log(o3.slice(-200)); c.end(); });
        });
      } else {
        c.end();
      }
    });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
