import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/e9a27c1b-33e5-4501-86f9-6630fb7bba6f/.system_generated/logs/transcript.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    for idx, line in enumerate(f):
        if "setDetailTab('filters')" in line:
            print(f"Match on line {idx}:")
            print(line[:400])
            print("---")
