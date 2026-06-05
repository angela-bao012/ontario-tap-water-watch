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
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'water_quality_data'
    `);
    console.log("Table columns:");
    for (const r of res.rows) {
      console.log(`  ${r.column_name}: ${r.data_type}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
