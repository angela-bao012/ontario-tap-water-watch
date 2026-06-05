import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

for file_name in ["server.ts", "App.tsx"]:
    print(f"=== EDITS FOR {file_name} ===")
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
                        if file_name in target_file:
                            print(f"Step {step_idx}: Tool {name}")
                            print(f"  Description: {args.get('Description')}")
                            print(f"  Instruction: {args.get('Instruction')}")
                            # Let's inspect specific fields
                            if name == "replace_file_content":
                                print(f"  TargetContent:\n{args.get('TargetContent')}")
                                print(f"  ReplacementContent:\n{args.get('ReplacementContent')}")
                            elif name == "multi_replace_file_content":
                                chunks = args.get("ReplacementChunks", [])
                                for c_idx, chunk in enumerate(chunks):
                                    print(f"  Chunk {c_idx} (StartLine={chunk.get('StartLine')}, EndLine={chunk.get('EndLine')}):")
                                    print(f"    TargetContent:\n{chunk.get('TargetContent')}")
                                    print(f"    ReplacementContent:\n{chunk.get('ReplacementContent')}")
                            elif name == "write_to_file":
                                print(f"  CodeContent length: {len(args.get('CodeContent', ''))}")
                            print("-" * 50)
            except Exception as e:
                pass
