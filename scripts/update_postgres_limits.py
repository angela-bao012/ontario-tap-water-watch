import sqlite3
import psycopg2
import os
import tempfile

SQLITE_PATH = "/Users/angelabao/ontario-tap-water-watch/water_data.db"
CONN_STRING = "postgresql://postgres:68391975@localhost:5432/water_watch"

def update_limits():
    print("Connecting to SQLite database...")
    lite_conn = sqlite3.connect(SQLITE_PATH)
    lite_cur = lite_conn.cursor()
    
    # Create temp CSV file
    temp_fd, temp_path = tempfile.mkstemp(suffix='.csv')
    print(f"Writing SQLite limits to temporary file: {temp_path}")
    
    try:
        # Fetch id and parameter_limit
        lite_cur.execute("SELECT id, parameter_limit FROM test_results;")
        
        with os.fdopen(temp_fd, 'w') as f:
            while True:
                rows = lite_cur.fetchmany(50000)
                if not rows:
                    break
                for row_id, limit in rows:
                    # Clean limit text: replace commas or newlines if any
                    limit_str = str(limit).replace('"', '""') if limit is not None else ""
                    f.write(f'{row_id},"{limit_str}"\n')
                    
        lite_conn.close()
        print("Finished writing SQLite data. Connecting to PostgreSQL...")
        
        pg_conn = psycopg2.connect(CONN_STRING)
        pg_cur = pg_conn.cursor()
        
        print("Altering PostgreSQL water_quality_data table...")
        pg_cur.execute("ALTER TABLE water_quality_data ADD COLUMN IF NOT EXISTS parameter_limit VARCHAR(50);")
        pg_conn.commit()
        
        print("Creating temporary PostgreSQL table...")
        pg_cur.execute("CREATE TEMP TABLE temp_limits (id INT PRIMARY KEY, parameter_limit VARCHAR(50));")
        pg_conn.commit()
        
        print("Copying CSV file into temporary PostgreSQL table...")
        with open(temp_path, 'r') as f:
            pg_cur.copy_expert("COPY temp_limits (id, parameter_limit) FROM STDIN WITH CSV", f)
        pg_conn.commit()
        
        print("Updating PostgreSQL water_quality_data using temp table (this may take a few seconds)...")
        pg_cur.execute("""
            UPDATE water_quality_data w
            SET parameter_limit = t.parameter_limit
            FROM temp_limits t
            WHERE w.id = t.id;
        """)
        pg_conn.commit()
        
        # Verify the migration
        pg_cur.execute("SELECT COUNT(*) FROM water_quality_data WHERE parameter_limit IS NOT NULL;")
        non_null_count = pg_cur.fetchone()[0]
        print(f"Update completed successfully! {non_null_count:,} rows updated with limits.")
        
        pg_cur.close()
        pg_conn.close()
        
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print("Cleaned up temporary file.")

if __name__ == '__main__':
    update_limits()
