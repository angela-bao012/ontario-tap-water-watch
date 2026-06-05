#!/usr/bin/env python3
import os
import csv
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime
import re

# Database connection configuration
DB_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:68391975@localhost:5432/water_watch")

CSV_FILES = [
    '2013-2017 CSV FINAL.csv',
    '2018-2022 Open Data CSV.csv',
    '2023-2024 Open Data.csv'
]

DWSP_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'DWSP')

def get_connection():
    return psycopg2.connect(DB_URL)

def create_table(conn):
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS raw_dwsp_data (
                id SERIAL PRIMARY KEY,
                dws_name VARCHAR(255),
                parameter_name VARCHAR(100),
                result_value NUMERIC,
                result_unit VARCHAR(50),
                sample_date DATE
            );
        """)
        # Truncate table to ensure clean start on re-run
        cur.execute("TRUNCATE TABLE raw_dwsp_data;")
    conn.commit()
    print("Table 'raw_dwsp_data' created and truncated successfully.")

def parse_result(val):
    if val is None or val == '' or val == '-' or val == 'N/A':
        return None
    if isinstance(val, (int, float)):
        return float(val)
    try:
        # Handle qualifiers like "<", ">" or comma grouping
        clean_val = re.sub(r'[^\d.-]', '', str(val))
        return float(clean_val) if clean_val else None
    except ValueError:
        return None

def get_date(sample_date):
    if sample_date is None or sample_date == '':
        return None
    if isinstance(sample_date, datetime):
        return sample_date.date()
    if hasattr(sample_date, 'date'):
        return sample_date.date()
    
    s = str(sample_date).strip()
    # Try different format matches
    for fmt in ('%Y-%m-%d', '%m/%d/%Y', '%Y/%m/%d', '%d-%m-%Y', '%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S'):
        try:
            return datetime.strptime(s[:10], fmt).date()
        except ValueError:
            continue
            
    # Try to find a 4-digit year and default to Jan 1st of that year
    m = re.search(r'(20\d{2})', s)
    if m:
        return datetime(int(m.group(1)), 1, 1).date()
    return None

def ingest_csv_files():
    conn = get_connection()
    create_table(conn)
    
    total_processed = 0
    total_inserted = 0
    
    # We will buffer rows for batch insertion
    insert_buffer = []
    
    for filename in CSV_FILES:
        filepath = os.path.join(DWSP_DIR, filename)
        if not os.path.exists(filepath):
            print(f"Warning: File {filepath} does not exist. Skipping.")
            continue
            
        print(f"Processing file: {filename}...")
        
        # Read the CSV file with utf-8-sig to auto-strip BOMs
        with open(filepath, mode='r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            try:
                headers = next(reader)
            except StopIteration:
                print(f"Warning: File {filename} is empty. Skipping.")
                continue
                
            # Clean header spaces and convert to lowercase for matching
            headers = [h.strip() for h in headers]
            
            # Map column names based on header indices
            col_dws_name = -1
            col_parameter = -1
            col_result_value = -1
            col_result_unit = -1
            col_sample_date = -1
            
            for idx, h in enumerate(headers):
                h_norm = h.lower().replace('_', ' ').replace('#', '').strip()
                
                # Check DWS Name
                if h_norm in ('drinking water system name', 'dws name', 'facility name', 'dws_name'):
                    col_dws_name = idx
                # Check Parameter Name
                elif h_norm in ('parameter', 'parameter name', 'parameter_name'):
                    col_parameter = idx
                # Check Result Value
                elif h_norm in ('result', 'result value', 'result_value', 'value'):
                    col_result_value = idx
                # Check Result Unit
                elif h_norm in ('result unit', 'result units', 'result_unit', 'unit'):
                    col_result_unit = idx
                # Check Sample Date
                elif h_norm in ('sample date', 'sample_date', 'date'):
                    col_sample_date = idx
            
            # Verify we found the columns
            if any(col == -1 for col in (col_dws_name, col_parameter, col_result_value, col_result_unit, col_sample_date)):
                print(f"Error: Missing required columns in {filename}. Found columns:")
                print(f"  DWS Name col: {col_dws_name} ('{headers[col_dws_name]}' if valid)")
                print(f"  Parameter col: {col_parameter}")
                print(f"  Result col: {col_result_value}")
                print(f"  Unit col: {col_result_unit}")
                print(f"  Date col: {col_sample_date}")
                continue
                
            file_inserted_count = 0
            
            for row_idx, row in enumerate(reader, start=2):
                if not row or len(row) <= max(col_dws_name, col_parameter, col_result_value, col_result_unit, col_sample_date):
                    continue
                    
                total_processed += 1
                
                param_val = row[col_parameter]
                if not param_val:
                    continue
                    
                param_upper = param_val.strip().upper()
                
                # Filter to only HARDNESS, IRON, and PH
                if param_upper not in ('HARDNESS', 'IRON', 'PH'):
                    continue
                    
                dws_name = row[col_dws_name].strip()
                result_val_raw = row[col_result_value]
                result_unit = row[col_result_unit].strip()
                sample_date_raw = row[col_sample_date]
                
                result_value = parse_result(result_val_raw)
                sample_date = get_date(sample_date_raw)
                
                # We standardize parameter name casing to HARDNESS, IRON, PH
                parameter_name = param_upper
                
                insert_buffer.append((
                    dws_name,
                    parameter_name,
                    result_value,
                    result_unit,
                    sample_date
                ))
                
                file_inserted_count += 1
                total_inserted += 1
                
                # Batch insert every 5000 rows
                if len(insert_buffer) >= 5000:
                    with conn.cursor() as cur:
                        execute_values(
                            cur,
                            "INSERT INTO raw_dwsp_data (dws_name, parameter_name, result_value, result_unit, sample_date) VALUES %s",
                            insert_buffer
                        )
                    conn.commit()
                    insert_buffer.clear()
            
            # Insert remaining buffer for this file
            if insert_buffer:
                with conn.cursor() as cur:
                    execute_values(
                        cur,
                        "INSERT INTO raw_dwsp_data (dws_name, parameter_name, result_value, result_unit, sample_date) VALUES %s",
                        insert_buffer
                    )
                conn.commit()
                insert_buffer.clear()
                
            print(f"Finished {filename}: parsed {file_inserted_count} matching rows.")
            
    conn.close()
    print("--------------------------------------------------")
    print(f"INGESTION COMPLETE!")
    print(f"Total processed CSV rows: {total_processed}")
    print(f"Total matched and inserted rows: {total_inserted}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    ingest_csv_files()
