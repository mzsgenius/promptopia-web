// Direct database sync script — creates tables + seeds product
// Run: node scripts/sync-db.mjs
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.rqlyuxjttfjndkmafypm:Mmzzss060112@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
  connectionTimeoutMillis: 15000,
});

async function run() {
  const client = await pool.connect();
  console.log('✓ Connected to database');

  // LicenseProduct
  await client.query(`
    CREATE TABLE IF NOT EXISTS "LicenseProduct" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration INTEGER,
      active BOOLEAN DEFAULT true,
      "createdAt" TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log('✓ LicenseProduct table ready');

  // Order
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "productId" TEXT NOT NULL REFERENCES "LicenseProduct"(id),
      "userId" TEXT,
      "userName" TEXT,
      "userEmail" TEXT,
      "userContact" TEXT,
      amount INTEGER NOT NULL,
      "paymentMethod" TEXT,
      "paymentProof" TEXT,
      status TEXT DEFAULT 'pending',
      "adminNotes" TEXT,
      "createdAt" TIMESTAMPTZ DEFAULT now(),
      "updatedAt" TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log('✓ Order table ready');

  // LicenseKey
  await client.query(`
    CREATE TABLE IF NOT EXISTS "LicenseKey" (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      key TEXT UNIQUE NOT NULL,
      "productId" TEXT NOT NULL REFERENCES "LicenseProduct"(id),
      "orderId" TEXT UNIQUE REFERENCES "Order"(id),
      "userId" TEXT,
      activated BOOLEAN DEFAULT false,
      "activatedAt" TIMESTAMPTZ,
      "deviceInfo" TEXT,
      "expiredAt" TIMESTAMPTZ,
      "createdAt" TIMESTAMPTZ DEFAULT now(),
      "updatedAt" TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log('✓ LicenseKey table ready');

  // Indexes
  await client.query('CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status)');
  await client.query('CREATE INDEX IF NOT EXISTS idx_licensekey_key ON "LicenseKey"(key)');
  console.log('✓ Indexes created');

  // Seed product
  const existing = await client.query('SELECT id FROM "LicenseProduct" WHERE active = true LIMIT 1');
  if (existing.rows.length === 0) {
    await client.query(`
      INSERT INTO "LicenseProduct" (name, price, duration, active)
      VALUES ('AI项目导师 · 专业版', 3990, NULL, true)
    `);
    console.log('✓ Product seeded: AI项目导师 · 专业版 ¥39.9');
  } else {
    console.log('✓ Product already exists');
  }

  client.release();
  console.log('\n=== 完成！数据库已就绪 ===');
  await pool.end();
}

run().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
