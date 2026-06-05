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
                    name = tc.get("name")
                    if name in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                        args = tc.get("args", {})
                        chunks = args.get("ReplacementChunks", [])
                        print(f"Type of chunks: {type(chunks)}")
                        if isinstance(chunks, str):
                            # Let's try to parse it
                            try:
                                chunks = json.loads(chunks)
                            except Exception as e:
                                # Clean up string and try parsing
                                print("Raw string length:", len(chunks))
                                # Maybe the log has it as a stringified list because of some logging format?
                                # Let's see what is inside the string:
                                print("Start of chunks string:", chunks[:200])
                                continue
                        
                        print(f"Number of chunks: {len(chunks)}")
                        for idx, chunk in enumerate(chunks):
                            print(f"  Chunk {idx}: StartLine={chunk.get('StartLine')}, EndLine={chunk.get('EndLine')}")
                            print("  TargetContent:")
                            print(chunk.get("TargetContent"))
                            print("  ReplacementContent:")
                            print(chunk.get("ReplacementContent"))
                            print("-" * 30)
        except Exception as e:
            print("Error parsing line:", e)
