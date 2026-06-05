import sqlite3

def inspect_sqlite():
    conn = sqlite3.connect("water_data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Tables in sqlite database:", tables)
    for table_name in tables:
        t_name = table_name[0]
        cursor.execute(f"PRAGMA table_info({t_name});")
        info = cursor.fetchall()
        print(f"\nTable {t_name} schema:")
        for col in info:
            print("  ", col)
        
        # Select first 3 rows
        cursor.execute(f"SELECT * FROM {t_name} LIMIT 3;")
        rows = cursor.fetchall()
        print(f"Table {t_name} sample rows:")
        for r in rows:
            print("  ", r)
            
    conn.close()

if __name__ == '__main__':
    inspect_sqlite()
