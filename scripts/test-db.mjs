import pg from "pg";
const url = "postgresql://postgres:postgres@localhost:51214/template1";
try {
  const p = new pg.Pool({ connectionString: url + "?sslmode=disable&connection_limit=10" });
  p.on("error", (e) => console.log("POOL_ERR:", e?.message || String(e)));
  const r = await p.query("SELECT 1 as ok");
  console.log("OK:", JSON.stringify(r.rows));
  await p.end();
} catch (e) {
  console.log("CAUGHT:", e?.constructor?.name, e?.message || String(e));
  if (e?.cause) console.log("CAUSE:", e.cause?.message || String(e.cause));
}
