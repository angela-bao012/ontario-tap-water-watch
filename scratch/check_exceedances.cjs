const pg = require('pg');
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:68391975@localhost:5432/water_watch",
});

async function run() {
  try {
    const res = await pool.query(
      `SELECT parameter_name, MAX(result_value) as max_val, COUNT(*) as cnt, SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) as exc_cnt
       FROM water_quality_data 
       WHERE location = 'BARE POINT ROAD DRINKING WATER SYSTEM' AND EXTRACT(YEAR FROM sample_date) = 2025
       GROUP BY parameter_name
       HAVING SUM(CASE WHEN exceedance = 'Y' THEN 1 ELSE 0 END) > 0
       ORDER BY max_val DESC`
    );
    console.log("EXCEEDING PARAMETERS FOR BARE POINT ROAD IN 2025:");
    console.log(JSON.stringify(res.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
