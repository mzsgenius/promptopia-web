// fix-layer-css.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web

# Remove the custom prose CSS we added at the end
sed -i "/^\\\\/\\\\* ── Prose styles/,/^\\\\/\\\\* ── Code/d" src/app/globals.css
sed -i "/^@plugin/d" src/app/globals.css

# Add prose CSS inside @layer base
# Find the closing } of @layer base and insert before it
python3 << "PYEOF"
f = "src/app/globals.css"
c = open(f).read()

prose_css = '''
  /* ── Prose styles ── */
  .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; }
  .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .prose p { margin-bottom: 0.75rem; line-height: 1.7; }
  .prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
  .prose ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
  .prose li { margin-bottom: 0.25rem; }
  .prose pre { background: #f6f8fa; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; font-size: 0.875rem; line-height: 1.6; }
  .dark .prose pre { background: #0d1117; border-color: #30363d; }
  .prose code { font-family: var(--font-geist-mono, monospace); font-size: 0.875em; }
  .prose pre code { background: none; border: none; padding: 0; font-size: inherit; }
  .prose blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; margin-bottom: 0.75rem; color: #6b7280; font-style: italic; }
  .dark .prose blockquote { border-color: #4b5563; color: #9ca3af; }
  .prose a { color: #2563eb; text-decoration: underline; }
  .dark .prose a { color: #60a5fa; }
'''

# Insert before the closing } of @layer base
c = c.replace("}\n\n/* ── Code highlighting", "}" + prose_css + "\n/* ── Code highlighting")
open(f, "w").write(c)
print("DONE")
PYEOF

npm run build 2>&1 | tail -5
pm2 restart promptopia
echo DONE
'`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-300)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
