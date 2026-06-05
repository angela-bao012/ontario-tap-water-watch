import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

conn = psycopg2.connect(db_url)
cur = conn.cursor()

# Query unique parameter names
cur.execute("""
    SELECT DISTINCT parameter_name, result_unit
    FROM water_quality_data
    WHERE location ILIKE '%windsor%' AND EXTRACT(YEAR FROM sample_date) = 2025
    ORDER BY parameter_name
""")
rows = cur.fetchall()
print(f"Total unique parameters for Windsor in 2025: {len(rows)}")
for r in rows:
    print(f"  {r[0]} ({r[1]})")

cur.close()
conn.close()
