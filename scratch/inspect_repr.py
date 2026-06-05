import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            if step_idx in [854, 939]:
                print(f"=== STEP {step_idx} ===")
                tool_calls = data.get("tool_calls", [])
                for tc in tool_calls:
                    args = tc.get("args", {})
                    chunks = args.get("ReplacementChunks", "")
                    print("Length of chunks string:", len(chunks))
                    print("repr(chunks)[:500]:")
                    print(repr(chunks)[:500])
                    print("repr(chunks)[-500:]:")
                    print(repr(chunks)[-500:])
        except Exception as e:
            pass
