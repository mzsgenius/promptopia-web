const { PrismaClient } = require('/root/promptopia-web/src/generated/prisma/client.js');
const { PrismaPg } = require('/root/promptopia-web/node_modules/@prisma/adapter-pg');
async function main() {
  const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const cats = await p.case.findMany({ select: { category: true } });
  const m = {};
  cats.forEach(function(c) { m[c.category] = (m[c.category] || 0) + 1; });
  const sorted = Object.entries(m).sort(function(a,b) { return b[1] - a[1]; });
  sorted.forEach(function(x) { console.log(x[0] + ': ' + x[1]); });
  await p.$disconnect();
}
main().catch(function(e) { console.log('ERR: ' + e.message); });
