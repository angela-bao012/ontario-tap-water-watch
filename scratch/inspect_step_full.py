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
                    print(f"Tool name: {tc.get('name')}")
                    args = tc.get("args", {})
                    print(f"TargetFile: {args.get('TargetFile')}")
                    # Write args to a temporary file
                    out_fn = f"/Users/angelabao/ontario-tap-water-watch/scratch/step_{step_idx}_args.json"
                    with open(out_fn, "w") as out_f:
                        json.dump(args, out_f, indent=2)
                    print(f"Saved args to {out_fn}")
        except Exception as e:
            pass
