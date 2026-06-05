import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/bb73e7cd-2f19-4449-90c4-50372594c2b4/.system_generated/logs/transcript.jsonl"

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
