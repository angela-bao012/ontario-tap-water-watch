import psycopg2
import os

CONN_STRING = os.environ.get("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

def check():
    conn = psycopg2.connect(CONN_STRING)
    cur = conn.cursor()
    
    # Query aggregated sample counts for year 2025 grouped by location and parameter
    cur.execute("""
        SELECT location, parameter_name, COUNT(*) 
        FROM water_quality_data 
        WHERE EXTRACT(YEAR FROM sample_date) = 2025
        GROUP BY location, parameter_name
        LIMIT 50;
    """)
    rows = cur.fetchall()
    print("Aggregate counts for 2025:")
    for r in rows:
        print(f"  {r[0]} | {r[1]} -> {r[2]}")
        
    cur.close()
    conn.close()

if __name__ == '__main__':
    check()
