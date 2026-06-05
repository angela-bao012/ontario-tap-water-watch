import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            if step_idx is not None and 10 <= step_idx <= 25:
                print(f"Step {step_idx}: type={data.get('type')}, source={data.get('source')}, status={data.get('status')}")
                if "tool_calls" in data:
                    print(f"  Tool calls: {len(data['tool_calls'])}")
                    for tc in data['tool_calls']:
                        print(f"    Name: {tc.get('name')}")
                        print(f"    Args: {list(tc.get('args', {}).keys())}")
                        # Check keys in the tool call dict
                        print(f"    Keys: {list(tc.keys())}")
                if "content" in data and data["content"]:
                    print(f"  Content: {repr(data['content'][:150])}...")
                print("*" * 40)
        except Exception as e:
            pass
