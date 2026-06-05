// build-and-start.mjs — fresh build + production start
import { Client } from "ssh2";
const conn = new Client();
conn.on("ready", () => {
  console.log("✅ SSH");

  conn.exec(`
cd /root/promptopia-web

# Install effect dep that Prisma 7 needs
npm install effect 2>&1 | tail -2

# Generate prisma client + build
npx prisma generate 2>&1 | tail -2
npm run build 2>&1 | tail -3

echo "BUILD_EXIT=$?"
  `.trim(), (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => {
      console.log(o.slice(-500));
      if (o.includes("BUILD_EXIT=0")) {
        // Start production on port 3000
        conn.exec(`
pm2 delete promptopia 2>/dev/null
cd /root/promptopia-web
pm2 start "node node_modules/.bin/next start -p 3000" --name promptopia
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
        `.trim(), (e2, s2) => {
          let o2 = "";
          s2.on("data", (d) => o2 += d.toString());
          s2.on("close", () => {
            console.log(o2);
            if (o2.includes("200")) {
              console.log("\n✅ http://150.109.70.58:3000");
            }
            conn.end();
          });
        });
      } else {
        console.log("❌ Build failed");
        conn.end();
      }
    });
  });
});
conn.connect({ host: "150.109.70.58", port: 22, username: "root", password: "Mmzzss060112" });
