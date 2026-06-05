import sqlite3
import psycopg2
import os
import tempfile
import re

SQLITE_PATH = "/Users/angelabao/ontario-tap-water-watch/water_data.db"
CONN_STRING = "postgresql://postgres:68391975@localhost:5432/water_watch"

def clean_location_better(raw_name):
    if not raw_name:
        return "Unknown Location"
    s = str(raw_name).strip()
    
    # 1. Remove prefixes like R243, R170 etc
    s = re.sub(r'^(R\d{3,5}\s+)|^(R\d{3,5}\s*-\s*)', '', s, flags=re.IGNORECASE)
    
    # 2. Remove trailing bracketed codes like (3157), (0000857), (877140)
    s = re.sub(r'\s*\([#\d]+\)\s*$', '', s)
    
    # 3. Strip common redundant suffixes (case-insensitive) but KEEP the part after "-"
    s = re.sub(r'\bDRINKING WATER SYSTEM\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bWELL SUPPLY\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bDISTRIBUTION SYSTEM\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bWATER TREATMENT PLANT\b', '', s, flags=re.IGNORECASE)
    s = re.sub(r'\bWTP\b', '', s, flags=re.IGNORECASE)
    
    # Clean up multiple hyphens, extra spaces, and trailing hyphens/spaces
    s = re.sub(r'\s*-\s*-+\s*', ' - ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s*-\s*$', '', s)
    s = re.sub(r'^-\s*', '', s)
    
    # Title Case properly
    s = s.title()
    small_words = {'Of': 'of', 'The': 'the', 'And': 'and', 'A': 'a', 'In': 'in', 'On': 'on', 'At': 'at', 'To': 'to', 'For': 'for', 'By': 'by', 'With': 'with'}
    words = s.split(' ')
    for i, w in enumerate(words):
        if w in small_words and i > 0:
            words[i] = small_words[w]
    s = ' '.join(words)
    
    # Final cleanup of spacing around hyphens
    s = re.sub(r'\s*-\s*', ' - ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def compute_unique_names(cur):
    cur.execute("SELECT dws_id, dws_name, owner_name, phu_name, dws_category FROM locations;")
    rows = cur.fetchall()
    
    # Clean names and collect groupings
    groups = {}
    for dws_id, dws_name, owner, phu, category in rows:
        cleaned = clean_location_better(dws_name)
        groups.setdefault(cleaned, []).append((dws_id, dws_name, owner, phu, category))
        
    resolved_names = {}
    for base_name, items in groups.items():
        if len(items) == 1:
            resolved_names[items[0][0]] = base_name
        else:
            # We have duplicates! Let's differentiate them by owner name or category
            for dws_id, dws_name, owner, phu, category in items:
                # Clean up owner name
                clean_owner = clean_location_better(owner or "")
                # If owner name is too generic or empty, use category or phu
                distinguisher = clean_owner
                if not distinguisher or distinguisher.lower() in ('unknown', 'n/a', ''):
                    distinguisher = category or phu or str(dws_id)
                
                # Make the distinguished name
                dist_name = f"{base_name} - {distinguisher}"
                # Let's ensure this is unique too
                counter = 2
                final_name = dist_name
                while final_name in resolved_names.values():
                    final_name = f"{dist_name} ({counter})"
                    counter += 1
                resolved_names[dws_id] = final_name
                
    return resolved_names

def update_metadata():
    print("Connecting to SQLite database...")
    lite_conn = sqlite3.connect(SQLITE_PATH)
    lite_cur = lite_conn.cursor()
    
    print("Computing unique, descriptive location names for all DWS IDs...")
    dws_name_map = compute_unique_names(lite_cur)
    print(f"Computed unique names for {len(dws_name_map):,} locations.")
    
    # Create temp CSV file
    temp_fd, temp_path = tempfile.mkstemp(suffix='.csv')
    print(f"Writing SQLite metadata to temporary file: {temp_path}")
    
    try:
        # Fetch id, dws_id, sample_type, owner_name from sqlite
        lite_cur.execute("""
            SELECT t.id, t.dws_id, t.sample_type, l.owner_name
            FROM test_results t
            LEFT JOIN locations l ON t.dws_id = l.dws_id;
        """)
        
        with os.fdopen(temp_fd, 'w') as f:
            while True:
                rows = lite_cur.fetchmany(50000)
                if not rows:
                    break
                for row_id, dws_id, sample_type, owner_name in rows:
                    # Resolve unique name
                    new_location = dws_name_map.get(dws_id, f"Unknown Location ({dws_id})")
                    
                    # Escape CSV values
                    loc_esc = new_location.replace('"', '""')
                    type_esc = (sample_type or "").replace('"', '""')
                    owner_esc = (owner_name or "").replace('"', '""')
                    
                    f.write(f'{row_id},"{loc_esc}","{owner_esc}","{type_esc}"\n')
                    
        lite_conn.close()
        print("Finished writing SQLite data. Connecting to PostgreSQL...")
        
        pg_conn = psycopg2.connect(CONN_STRING)
        pg_cur = pg_conn.cursor()
        
        print("Altering PostgreSQL water_quality_data table...")
        pg_cur.execute("ALTER TABLE water_quality_data ADD COLUMN IF NOT EXISTS owner_name VARCHAR(255);")
        pg_cur.execute("ALTER TABLE water_quality_data ADD COLUMN IF NOT EXISTS sample_type VARCHAR(100);")
        pg_conn.commit()
        
        print("Creating temporary PostgreSQL table...")
        pg_cur.execute("CREATE TEMP TABLE temp_meta (id INT PRIMARY KEY, location VARCHAR(255), owner_name VARCHAR(255), sample_type VARCHAR(100));")
        pg_conn.commit()
        
        print("Copying CSV file into temporary PostgreSQL table...")
        with open(temp_path, 'r') as f:
            pg_cur.copy_expert("COPY temp_meta (id, location, owner_name, sample_type) FROM STDIN WITH CSV", f)
        pg_conn.commit()
        
        print("Updating PostgreSQL water_quality_data using temp table (this may take a few minutes)...")
        pg_cur.execute("""
            UPDATE water_quality_data w
            SET location = t.location,
                owner_name = t.owner_name,
                sample_type = t.sample_type
            FROM temp_meta t
            WHERE w.id = t.id;
        """)
        pg_conn.commit()
        
        # Verify the migration
        pg_cur.execute("SELECT COUNT(*) FROM water_quality_data WHERE owner_name IS NOT NULL;")
        owner_count = pg_cur.fetchone()[0]
        pg_cur.execute("SELECT COUNT(*) FROM water_quality_data WHERE sample_type IS NOT NULL;")
        type_count = pg_cur.fetchone()[0]
        print(f"Update completed successfully! {owner_count:,} rows updated with owner names, {type_count:,} rows updated with sample types.")
        
        pg_cur.close()
        pg_conn.close()
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print("Cleaned up temporary file.")

if __name__ == '__main__':
    update_metadata()
