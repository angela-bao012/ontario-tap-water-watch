import json
import re

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

reconstructed_lines = {}

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            step_type = data.get("type")
            if step_type == "VIEW_FILE" and step_idx is not None and step_idx < 328:
                content = data.get("content", "")
                if "Search.tsx" in content:
                    lines = content.split('\n')
                    for l in lines:
                        match = re.match(r"^(\d+):\s(.*)$", l)
                        if match:
                            line_num = int(match.group(1))
                            line_content = match.group(2)
                            reconstructed_lines[line_num] = line_content
        except Exception as e:
            pass

print(f"Total original lines reconstructed (before step 328): {len(reconstructed_lines)}")
if reconstructed_lines:
    max_line = max(reconstructed_lines.keys())
    print(f"Max line number: {max_line}")
    with open("/Users/angelabao/ontario-tap-water-watch/scratch/original_Search_pre328.tsx", "w", encoding="utf-8") as out:
        for i in range(1, max_line + 1):
            if i in reconstructed_lines:
                out.write(reconstructed_lines[i] + "\n")
            else:
                out.write(f"// MISSING LINE {i}\n")
    print("Saved to original_Search_pre328.tsx")
