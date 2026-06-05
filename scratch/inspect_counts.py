import psycopg2
import os

CONN_STRING = os.environ.get("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

def inspect():
    conn = psycopg2.connect(CONN_STRING)
    cur = conn.cursor()
    
    # Let's count sample sizes for different locations, years, and parameters
    cur.execute("""
        SELECT location, EXTRACT(YEAR FROM sample_date) as year, parameter_name, COUNT(*) 
        FROM water_quality_data 
        GROUP BY location, year, parameter_name 
        LIMIT 20;
    """)
    print("Sample of raw counts:")
    for r in cur.fetchall():
        print(f"  {r[0]} | {r[1]} | {r[2]}: {r[3]}")
        
    # Let's see if 6 is a very common number
    cur.execute("""
        SELECT count_val, COUNT(*) FROM (
            SELECT COUNT(*) as count_val
            FROM water_quality_data 
            GROUP BY location, EXTRACT(YEAR FROM sample_date), parameter_name
        ) as sub
        GROUP BY count_val
        ORDER BY COUNT(*) DESC
        LIMIT 10;
    """)
    print("\nMost common sample counts per location-year-parameter group:")
    for r in cur.fetchall():
        print(f"  Count {r[0]}: {r[1]} occurrences")

    cur.close()
    conn.close()

if __name__ == '__main__':
    inspect()
