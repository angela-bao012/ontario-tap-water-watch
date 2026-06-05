import psycopg2

DB_URL = "postgresql://postgres:68391975@localhost:5432/water_watch"

def check():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    cur.execute("SELECT location, display_name FROM water_quality_data WHERE location = 'CITY OF WINDSOR DRINKING WATER SYSTEM' LIMIT 5;")
    rows = cur.fetchall()
    print("Direct query results for WINDSOR:")
    for r in rows:
        print(f"  Raw: {r[0]!r} -> Display: {r[1]!r}")
        
    cur.close()
    conn.close()

if __name__ == '__main__':
    check()
