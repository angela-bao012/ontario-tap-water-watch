file_path = "/Users/angelabao/ontario-tap-water-watch/src/pages/Search.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx in range(2405, 2440):
    if idx < len(lines):
        print(f"L{idx+1}: {lines[idx]}", end="")
