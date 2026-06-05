import json

def inspect_args(filepath):
    print(f"=== {filepath} ===")
    with open(filepath, 'r') as f:
        data = json.load(f)
    print("Description:", data.get("Description"))
    print("Instruction:", data.get("Instruction"))
    chunks_val = data.get("ReplacementChunks")
    
    if isinstance(chunks_val, str):
        try:
            chunks = json.loads(chunks_val)
        except Exception as e:
            print("Failed parsing chunks string:", e)
            chunks = []
    else:
        chunks = chunks_val or []
    
    print(f"Number of chunks: {len(chunks)}")
    for idx, c in enumerate(chunks):
        print(f"Chunk {idx} (lines {c.get('StartLine')} to {c.get('EndLine')}):")
        print("--- TargetContent ---")
        print(c.get("TargetContent"))
        print("--- ReplacementContent ---")
        print(c.get("ReplacementContent"))
        print("="*40)

inspect_args("/Users/angelabao/ontario-tap-water-watch/scratch/step_854_args.json")
inspect_args("/Users/angelabao/ontario-tap-water-watch/scratch/step_939_args.json")
