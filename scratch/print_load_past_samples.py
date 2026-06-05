import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            step_type = data.get("type")
            if step_idx == 169 and step_type == "VIEW_FILE":
                content = data.get("content", "")
                lines = content.split('\n')
                for i, l in enumerate(lines):
                    if "loadPastSamples" in l:
                        print(f"Step 169 matches:")
                        for j in range(max(0, i-2), min(len(lines), i+25)):
                            print(f"  {lines[j]}")
                        print("-" * 50)
                        break
        except Exception as e:
            pass
