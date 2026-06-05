import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

modified_files = set()

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                    args = tc.get("args", {})
                    target_file = args.get("TargetFile", "")
                    if target_file:
                        modified_files.add(target_file)
        except Exception:
            pass

print("All modified files in logs:")
for f in sorted(modified_files):
    print(f"  {f}")
