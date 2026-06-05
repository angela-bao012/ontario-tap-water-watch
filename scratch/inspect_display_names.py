import psycopg2

DB_URL = "postgresql://postgres:68391975@localhost:5432/water_watch"

def inspect():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Hyphenated display names
    print("Hyphenated display name examples:")
    cur.execute("""
        SELECT DISTINCT location, display_name 
        FROM water_quality_data 
        WHERE location LIKE '%-%' AND display_name IS NOT NULL 
        LIMIT 15;
    """)
    for row in cur.fetchall():
        print(f"  Raw: {row[0]!r} -> Display: {row[1]!r}")
        
    # "CITY OF", "TOWN OF" display names
    print("\nMunicipal prefix display name examples:")
    cur.execute("""
        SELECT DISTINCT location, display_name 
        FROM water_quality_data 
        WHERE (location LIKE '%CITY OF%' OR location LIKE '%TOWN OF%' OR location LIKE '%REGIONAL MUNICIPALITY OF%')
          AND display_name IS NOT NULL 
        LIMIT 15;
    """)
    for row in cur.fetchall():
        print(f"  Raw: {row[0]!r} -> Display: {row[1]!r}")
        
    cur.close()
    conn.close()

if __name__ == '__main__':
    inspect()
