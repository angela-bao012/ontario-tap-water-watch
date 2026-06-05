import psycopg2
import os

CONN_STRING = os.environ.get("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

def inspect():
    conn = psycopg2.connect(CONN_STRING)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT parameter_name, result_unit, COUNT(*)
        FROM water_quality_data
        WHERE location ILIKE '%WINDSOR%' AND EXTRACT(YEAR FROM sample_date) = 2025
        GROUP BY parameter_name, result_unit
        ORDER BY COUNT(*) DESC;
    """)
    print("Windsor 2025 parameter counts:")
    for r in cur.fetchall():
        print(f"  {r[0]} ({r[1]}): {r[2]}")
        
    cur.close()
    conn.close()

if __name__ == '__main__':
    inspect()
