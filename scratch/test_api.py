import urllib.request
import json

def test():
    loc = "10 MECHANIC STREET W MAXVILLE WELL SUPPLY"
    url = f"http://localhost:3000/api/water-data?location={urllib.parse.quote(loc)}&year=2019&microbe={urllib.parse.quote('Escherichia Coli')}&limit=1000"
    print("Fetching URL:", url)
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        print("Number of raw samples returned:", len(data))
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    test()
