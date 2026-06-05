import urllib.request
import json

url = "http://localhost:3000/api/health"

try:
    with urllib.request.urlopen(url) as response:
        html = response.read().decode('utf-8')
        data = json.loads(html)
        print("API Health:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print("Error querying API Health:", e)
