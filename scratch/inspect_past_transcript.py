import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                source = data.get("source")
                type_val = data.get("type")
                if source == "USER_EXPLICIT" or type_val == "USER_INPUT":
                    print(f"User input: {data.get('content')}")
            except Exception as e:
                pass
except Exception as err:
    print("Could not open file:", err)
