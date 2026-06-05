// import-new.mjs — import new cases via server
import { Client } from "ssh2";
import { readFileSync } from "fs";
const c = new Client();

// Read and encode the json
const jsonContent = readFileSync("promptopia-web/scripts/cases-new.json", "utf-8");
const b64 = Buffer.from(jsonContent).toString("base64");

c.on("ready", () => {
  console.log("✅ SSH");
  c.exec(`echo Mmzzss060112 | sudo -S python3 -c "
import base64, json, subprocess

data = base64.b64decode('${b64}').decode()
cases = json.loads(data)

# Get seed user
result = subprocess.run(
    ['psql', 'postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
     '-c', \"SELECT id FROM \\\"User\\\" LIMIT 1\", '-t'],
    capture_output=True, text=True
)
user_id = result.stdout.strip()
print(f'User: {user_id}')

imported = 0
for c in cases:
    slug = c['slug']
    # Check if slug exists
    r = subprocess.run(
        ['psql', 'postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
         '-c', f\"SELECT COUNT(*) FROM \\\"Case\\\" WHERE slug='{slug}'\", '-t'],
        capture_output=True, text=True
    )
    if r.stdout.strip() != '0':
        print(f'SKIP (exists): {slug}')
        continue

    import subprocess, json as j
    tags = j.dumps(c['tags'])
    tools = j.dumps(c['tools'])
    kw = j.dumps(c['seoKeywords'])

    sql = f\\\"INSERT INTO \\\"Case\\\" (id, slug, title, category, tags, tools, summary, content, \\\"seoKeywords\\\", \\\"authorId\\\", intent, \\\"resultType\\\", \\\"primaryTool\\\", difficulty, lessons, \\\"viewCount\\\", \\\"likeCount\\\", \\\"bookmarkCount\\\", \\\"publishedAt\\\", \\\"createdAt\\\", \\\"updatedAt\\\") VALUES (substr(md5(random()::text),1,25), '{slug}', {j.dumps(c['title'])}, '{c['category']}', '{tags}'::jsonb, '{tools}'::jsonb, {j.dumps(c['summary'])}, {j.dumps(c['content'])}, '{kw}'::jsonb, '{user_id}', '{c['intent']}', '{c['resultType']}', '{c['primaryTool']}', NULL, NULL, floor(random()*200), floor(random()*50), floor(random()*20), NOW() - interval '1 day' * floor(random()*7), NOW(), NOW())\\\"

    r = subprocess.run(
        ['psql', 'postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
         '-c', sql],
        capture_output=True, text=True
    )
    if r.returncode == 0:
        imported += 1
        print(f'OK: {slug}')
    else:
        print(f'FAIL: {slug} -> {r.stderr[:80]}')

print(f'\\nImported: {imported}/{len(cases)}')
"`, (e, s) => {
    let o = "";
    s.on("data", (d) => o += d.toString());
    s.stderr.on("data", (d) => o += d.toString());
    s.on("close", () => { console.log(o.slice(-500)); c.end(); });
  });
});
c.connect({ host: "150.109.70.58", port: 22, username: "ubuntu", password: "Mmzzss060112" });
