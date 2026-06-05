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
    # Instead of stripping DRINKING WATER SYSTEM and everything after it, we just strip the words DRINKING WATER SYSTEM/WELL SUPPLY/etc. itself
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

def test_cleaning():
    conn = sqlite3.connect(SQLITE_PATH)
    cur = conn.cursor()
    cur.execute("SELECT dws_id, dws_name, owner_name, phu_name FROM locations;")
    rows = cur.fetchall()
    
    cleaned_names = {}
    duplicates = {}
    
    for dws_id, dws_name, owner, phu in rows:
        cleaned = clean_location_better(dws_name)
        if cleaned in cleaned_names:
            duplicates.setdefault(cleaned, []).append((dws_id, dws_name, owner, phu))
        else:
            cleaned_names[cleaned] = (dws_id, dws_name, owner, phu)
            
    print(f"Total locations: {len(rows)}")
    print(f"Cleaned unique locations: {len(cleaned_names)}")
    print(f"Duplicate groups: {len(duplicates)}")
    
    # Print duplicate groups
    count = 0
    for name, group in duplicates.items():
        first = cleaned_names[name]
        all_items = [first] + group
        print(f"\nGroup: {name}")
        for d_id, orig_name, owner, phu in all_items:
            print(f"  dws_id: {d_id} | original: '{orig_name}' | owner: '{owner}' | phu: '{phu}'")
        count += 1
        if count >= 10:
            break
            
    conn.close()

if __name__ == '__main__':
    test_cleaning()
