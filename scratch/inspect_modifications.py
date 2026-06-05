import json
import os

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

files_of_interest = ["App.tsx", "server.ts", "Search.tsx"]

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            tool_calls = data.get("tool_calls", [])
            for tc in tool_calls:
                name = tc.get("name")
                if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                    args = tc.get("args", {})
                    target_file = args.get("TargetFile", "")
                    matched_file = next((f for f in files_of_interest if f in target_file), None)
                    if matched_file:
                        print(f"Step {step_idx}: Tool {name} modified {matched_file}")
                        # Print description/instruction/replacement content summary
                        desc = args.get("Description", "")
                        inst = args.get("Instruction", "")
                        print(f"  Description: {desc}")
                        print(f"  Instruction: {inst}")
                        if name == "replace_file_content":
                            print(f"  TargetContent length: {len(args.get('TargetContent', ''))}")
                            print(f"  ReplacementContent length: {len(args.get('ReplacementContent', ''))}")
                        elif name == "multi_replace_file_content":
                            chunks = args.get("ReplacementChunks", [])
                            print(f"  ReplacementChunks count: {len(chunks)}")
                            for idx, chunk in enumerate(chunks):
                                print(f"    Chunk {idx}: lines {chunk.get('StartLine')}-{chunk.get('EndLine')}, target length {len(chunk.get('TargetContent', ''))} -> replacement length {len(chunk.get('ReplacementContent', ''))}")
                        print("-" * 40)
        except Exception as e:
            pass
