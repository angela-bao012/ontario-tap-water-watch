import re

bundle_path = "/Users/angelabao/ontario-tap-water-watch/dist/assets/index-BjvDXAd8.js"

with open(bundle_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for some function signatures or keywords in the minified bundle
keywords = ["fetchWaterData", "water-data", "dwsp_data", "getParameterCategory", "getParameterDescription", "microbeConfig"]

for kw in keywords:
    matches = [m.start() for m in re.finditer(re.escape(kw), content)]
    print(f"Keyword '{kw}': {len(matches)} matches")
    for idx, pos in enumerate(matches[:3]):
        # Print 200 chars around the match
        start = max(0, pos - 100)
        end = min(len(content), pos + 200)
        snippet = content[start:end]
        print(f"  Match {idx}: ... {snippet} ...")
        print("-" * 30)
