// fix-prose-css.mjs
import { Client } from "ssh2";
const c = new Client();
c.on("ready", () => {
  c.exec(`echo Mmzzss060112 | sudo -S bash -c '
cd /root/promptopia-web

# Remove the @plugin line
sed -i "/@plugin/d" src/app/globals.css

# Add direct prose CSS at the end of the file
cat >> src/app/globals.css << "EOF"

/* ── Prose styles for markdown content ── */
.prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; }
.prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
.prose p { margin-bottom: 0.75rem; line-height: 1.7; }
.prose ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.prose ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.prose li { margin-bottom: 0.25rem; }
.prose pre {
  background: #f6f8fa; border: 1px solid #e5e7eb; border-radius: 0.75rem;
  padding: 1rem; overflow-x: auto; margin-bottom: 1rem; font-size: 0.875rem;
  line-height: 1.6;
}
.dark .prose pre { background: #0d1117; border-color: #30363d; }
.prose code {
  font-family: var(--font-geist-mono, monospace);
  font-size: 0.875em;
}
.prose pre code {
  background: none; border: none; padding: 0; font-size: inherit;
}
.prose blockquote {
  border-left: 4px solid #d1d5db; padding-left: 1rem; margin-bottom: 0.75rem;
  color: #6b7280; font-style: italic;
}
.dark .prose blockquote { border-color: #4b5563; color: #9ca3af; }
.prose hr { margin: 2rem 0; border-color: #e5e7eb; }
.dark .prose hr { border-color: #374151; }
.prose a { color: #2563eb; text-decoration: underline; }
.dark .prose a { color: #60a5fa; }
.prose strong { font-weight: 600; }
.prose table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
.prose th, .prose td { border: 1px solid #e5e7eb; padding: 0.5rem 0.75rem; text-align: left; }
.dark .prose th, .dark .prose td { border-color: #374151; }
.prose th { background: #f9fafb; font-weight: 500; }
.dark .prose th { background: #1f2937; }
EOF

echo "CSS added, rebuilding..."
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
