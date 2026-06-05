const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:68391975@localhost:5432/water_watch",
});

async function main() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT DISTINCT parameter_name, result_unit
      FROM water_quality_data
      WHERE location ILIKE '%windsor%' AND EXTRACT(YEAR FROM sample_date) = 2025
      ORDER BY parameter_name
    `);
    console.log(`Total unique parameters for Windsor in 2025: ${res.rows.length}`);
    for (const r of res.rows) {
      console.log(`  ${r.parameter_name} (${r.result_unit})`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
