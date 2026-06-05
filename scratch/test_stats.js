import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:68391975@localhost:5432/water_watch",
});

async function run() {
  try {
    const matchedLocs = ['CITY OF TORONTO DRINKING WATER SYSTEM - F. J. HORGAN'];
    const statsQuery = `
      SELECT 
        location,
        COUNT(*) as total,
        SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exceeded,
        ARRAY_AGG(DISTINCT sample_type) FILTER (WHERE sample_type IS NOT NULL AND sample_type <> '') as types,
        TO_CHAR(MAX(sample_date), 'YYYY-MM-DD') as latest_date
      FROM water_quality_data
      WHERE location = ANY($1)
      GROUP BY location
    `;
    const statsRes = await pool.query(statsQuery, [matchedLocs]);
    console.log("Stats rows:", statsRes.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
