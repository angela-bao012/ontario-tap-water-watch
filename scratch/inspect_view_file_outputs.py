import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                if tc.get("name") == "view_file" and "Search.tsx" in tc.get("args", {}).get("AbsolutePath", ""):
                    output = tc.get("output", "")
                    print(f"Step {step_idx}: tool output len={len(output)}")
                    if output:
                        print("Output start:", repr(output[:200]))
                        # Let's save output to a file
                        out_fn = f"/Users/angelabao/ontario-tap-water-watch/scratch/step_{step_idx}_view.txt"
                        with open(out_fn, "w", encoding="utf-8") as out_f:
                            out_f.write(output)
                        print(f"Saved to {out_fn}")
        except Exception as e:
            pass
