import json

log_path = "/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_idx = data.get("step_index")
            if step_idx is not None and step_idx >= 900:
                tool_calls = data.get("tool_calls", [])
                for tc in tool_calls:
                    name = tc.get("name")
                    if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                        args = tc.get("args", {})
                        target_file = args.get("TargetFile", "")
                        print(f"Step {step_idx}: Tool {name} modified {target_file}")
                        print(f"  Description: {args.get('Description')}")
                        print(f"  Instruction: {args.get('Instruction')}")
                        if name == "write_to_file":
                            # print length of content
                            print(f"  CodeContent length: {len(args.get('CodeContent', ''))}")
                        elif name == "replace_file_content":
                            print(f"  TargetContent length: {len(args.get('TargetContent', ''))}")
                            print(f"  ReplacementContent: {args.get('ReplacementContent')}")
                        elif name == "multi_replace_file_content":
                            chunks = args.get("ReplacementChunks", [])
                            print(f"  Chunks count: {len(chunks)}")
                            for idx, chunk in enumerate(chunks):
                                print(f"    Chunk {idx} (StartLine={chunk.get('StartLine')}, EndLine={chunk.get('EndLine')}): target length {len(chunk.get('TargetContent', ''))}")
                        print("-" * 50)
        except Exception as e:
            pass
