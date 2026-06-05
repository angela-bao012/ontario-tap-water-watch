import json
import re

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

found_versions = []

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            step_type = data.get("type")
            if step_type == "VIEW_FILE":
                content = data.get("content", "")
                if "fetchWaterData" in content:
                    # Extract the fetchWaterData block
                    match = re.search(r"const fetchWaterData = async.*?\n  };", content, re.DOTALL)
                    if match:
                        version = match.group(0)
                        if version not in found_versions:
                            found_versions.append(version)
                            print(f"Step {step_idx} version:")
                            print(version)
                            print("-" * 50)
        except Exception as e:
            pass
