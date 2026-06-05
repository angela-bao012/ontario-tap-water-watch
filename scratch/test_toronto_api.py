import urllib.request
import json

def test():
    loc = "CITY OF TORONTO DRINKING WATER SYSTEM - TORONTO DS"
    # Fetch raw water data for Escherichia Coli in 2025
    url = f"http://localhost:3000/api/water-data?location={urllib.parse.quote(loc)}&year=2025&microbe={urllib.parse.quote('Escherichia Coli')}&limit=1000"
    print("Fetching URL:", url)
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        print("Number of raw samples returned:", len(data))
        print("First 10 raw samples:")
        for idx, sample in enumerate(data[:10]):
            print(f"  Sample {idx}: date={sample.get('sample_date')}, value={sample.get('result_value')}, unit={sample.get('result_unit')}")
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    test()
