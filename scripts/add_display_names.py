#!/usr/bin/env python3
import os
import psycopg2
import re

DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

def title_case_name(s):
    if not s:
        return ""
    words = s.split()
    title_words = []
    
    lowercase_words = {'of', 'and', 'the', 'for', 'in', 'on', 'at', 'to', 'by', 'with', 'a', 'an'}
    
    for i, w in enumerate(words):
        clean_w = re.sub(r'[^\w]', '', w).lower()
        if clean_w in lowercase_words and i > 0:
            title_words.append(w.lower())
        else:
            if '-' in w:
                sub_parts = w.split('-')
                sub_parts_title = [sub_p.capitalize() if len(sub_p) > 0 else "" for sub_p in sub_parts]
                title_words.append('-'.join(sub_parts_title))
            else:
                if len(w) > 1 and w[0].isalpha() and w[1] == '.':
                    title_words.append(w[0].upper() + w[1:])
                else:
                    title_words.append(w.capitalize())
                    
    return ' '.join(title_words)

def clean_infra(text):
    infra_words = [
        'DRINKING WATER SYSTEM', 'DRINKING WATER', 'WATER SYSTEM', 'DISTRIBUTION SYSTEM', 
        'DISTRIBUTION', 'WELL SUPPLY', 'SUPPLY WELL', 'SUPPLY', 'FACILITY'
    ]
    cleaned = text
    for w in infra_words:
        cleaned = re.sub(r'\b' + re.escape(w) + r'\b', '', cleaned, flags=re.IGNORECASE)
    return ' '.join(cleaned.split()).strip()

def make_display_name(raw_name):
    if not raw_name:
        return ""
    
    # Clean up codes
    s = re.sub(r'^(R\d{3,6}\s*-\s*)|^(R\d{3,6}\s+)', '', raw_name, flags=re.IGNORECASE)
    s = re.sub(r'\s*\([#\d]+\)\s*$', '', s)
    s = ' '.join(s.split()).strip()
    
    # Pre-process wells to keep "Well" but strip "Supply"
    s = re.sub(r'\bWELL SUPPLY\b', 'WELL', s, flags=re.IGNORECASE)
    s = re.sub(r'\bSUPPLY WELL\b', 'WELL', s, flags=re.IGNORECASE)
    
    # Split on hyphens with spaces (Region - Facility)
    if re.search(r'\s+-\s+', s):
        parts = [p.strip() for p in re.split(r'\s+-\s+', s)]
        if len(parts) >= 2:
            region_idx = -1
            region_indicators = ["CITY OF", "TOWN OF", "TOWNSHIP OF", "MUNICIPALITY OF", "REGIONAL MUNICIPALITY", "COUNTY OF", "DISTRICT OF", "COMMUNITY OF"]
            for idx, part in enumerate(parts):
                if any(ind in part.upper() for ind in region_indicators):
                    region_idx = idx
                    break
            
            if region_idx != -1:
                region_raw = parts[region_idx]
                other_parts = [p for i, p in enumerate(parts) if i != region_idx]
                facility_raw = " - ".join(other_parts)
            else:
                region_raw = parts[0]
                facility_raw = " - ".join(parts[1:])
            
            region_clean = clean_infra(region_raw)
            facility_clean = clean_infra(facility_raw)
            
            region_title = title_case_name(region_clean)
            facility_title = title_case_name(facility_clean)
            
            facility_title = re.sub(r'\b([A-Z])\.\s+([A-Z])\.', r'\1.\2.', facility_title, flags=re.IGNORECASE)
            
            if any(term in region_raw.upper() for term in ["DRINKING WATER SYSTEM", "WATER TREATMENT", "WTP"]):
                if not any(facility_title.lower().endswith(term) for term in ["plant", "well", "system", "school", "centre"]):
                    facility_title = f"{facility_title} Water Plant"
            
            return f"{facility_title} - {region_title}"

    cleaned = clean_infra(s)
    title_name = title_case_name(cleaned)
    return title_name

def migrate():
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("Altering table to add 'display_name' column if not exists...")
    cur.execute("ALTER TABLE water_quality_data ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);")
    conn.commit()
    
    print("Fetching unique location names...")
    cur.execute("SELECT DISTINCT location FROM water_quality_data WHERE location IS NOT NULL;")
    locations = [r[0] for r in cur.fetchall()]
    print(f"Found {len(locations)} unique locations.")
    
    print("Updating display_name values...")
    count = 0
    for loc in locations:
        disp = make_display_name(loc)
        cur.execute("UPDATE water_quality_data SET display_name = %s WHERE location = %s;", (disp, loc))
        count += 1
        if count % 1000 == 0:
            print(f"  Updated {count}/{len(locations)} locations...")
            conn.commit()
            
    conn.commit()
    print("Migration finished successfully.")
    cur.close()
    conn.close()

if __name__ == "__main__":
    migrate()
