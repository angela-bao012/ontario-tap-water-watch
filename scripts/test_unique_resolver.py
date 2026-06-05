import sqlite3
import re

SQLITE_PATH = "water_data.db"

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

def resolve_unique_names():
    conn = sqlite3.connect(SQLITE_PATH)
    cur = conn.cursor()
    cur.execute("SELECT dws_id, dws_name, owner_name, phu_name, dws_category FROM locations;")
    rows = cur.fetchall()
    
    # First pass: clean names and collect groupings
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
                
    # Verify duplicates are completely gone
    assert len(resolved_names) == len(rows), f"Length mismatch: {len(resolved_names)} vs {len(rows)}"
    unique_vals = set(resolved_names.values())
    print(f"Total locations: {len(rows)}")
    print(f"Unique resolved names: {len(unique_vals)}")
    print(f"Conflicts remaining: {len(rows) - len(unique_vals)}")
    
    # Let's print some resolved Toronto names
    print("\nResolved Toronto Names:")
    for dws_id, name in resolved_names.items():
        if 'toronto' in name.lower():
            print(f"  dws_id: {dws_id} -> '{name}'")
            
    conn.close()

if __name__ == '__main__':
    resolve_unique_names()
