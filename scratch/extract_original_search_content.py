import json
import re

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

reconstructed_lines = {}

# We will read transcript.jsonl. Since we know that VIEW_FILE steps follow the PLANNER_RESPONSE steps that request them,
# we can look for VIEW_FILE steps.
# When a VIEW_FILE step occurs, we can look at the content field, parse it for line numbers (e.g., "123:   some code"),
# and save it.

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_type = data.get("type")
            if step_type == "VIEW_FILE":
                content = data.get("content", "")
                if "Search.tsx" in content:
                    # Extract lines
                    lines = content.split('\n')
                    for l in lines:
                        match = re.match(r"^(\d+):\s(.*)$", l)
                        if match:
                            line_num = int(match.group(1))
                            line_content = match.group(2)
                            reconstructed_lines[line_num] = line_content
        except Exception as e:
            pass

print(f"Total reconstructed lines: {len(reconstructed_lines)}")
if reconstructed_lines:
    max_line = max(reconstructed_lines.keys())
    print(f"Max line number: {max_line}")
    with open("/Users/angelabao/ontario-tap-water-watch/scratch/reconstructed_Search.tsx", "w", encoding="utf-8") as out:
        for i in range(1, max_line + 1):
            if i in reconstructed_lines:
                out.write(reconstructed_lines[i] + "\n")
            else:
                out.write(f"// MISSING LINE {i}\n")
    print("Saved to reconstructed_Search.tsx")
