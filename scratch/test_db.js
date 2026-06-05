import pg from 'pg';

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:68391975@localhost:5432/water_watch",
});

async function run() {
  try {
    const q = 'windsor';
    const year = 2025;
    
    let query = `
      SELECT 
        location,
        MAX(display_name) as display_name,
        COUNT(*) as total
      FROM water_quality_data
      WHERE location ILIKE $1
        AND EXTRACT(YEAR FROM sample_date) = $2
      GROUP BY location
      ORDER BY location
      LIMIT 10
    `;
    
    console.log("Running query with Node.js pg driver...");
    const res = await pool.query(query, [`%${q}%`, year]);
    console.log("Results:");
    res.rows.forEach(row => {
      console.log(`  location: ${row.location}`);
      console.log(`  display_name: ${row.display_name}`);
      console.log(`  row keys: ${Object.keys(row)}`);
      console.log(`  row raw:`, row);
      console.log("---");
    });
    
  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await pool.end();
  }
}

run();
