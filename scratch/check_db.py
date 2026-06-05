import psycopg2

DB_URL = "postgresql://postgres:68391975@localhost:5432/water_watch"

def check():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # 1. Total row count where display_name is not null
    cur.execute("SELECT COUNT(*) FROM water_quality_data WHERE display_name IS NOT NULL;")
    count = cur.fetchone()[0]
    print(f"Total rows with display_name: {count}")
    
    # 2. Preview 10 rows
    cur.execute("SELECT location, display_name FROM water_quality_data WHERE display_name IS NOT NULL LIMIT 10;")
    rows = cur.fetchall()
    print("Sample rows:")
    for r in rows:
        print(f"  Raw: {r[0]!r} -> Display: {r[1]!r}")
        
    cur.close()
    conn.close()

if __name__ == '__main__':
    check()
