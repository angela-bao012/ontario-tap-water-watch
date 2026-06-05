file_path = "/Users/angelabao/ontario-tap-water-watch/src/pages/Search.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

p_balance = 0
b_balance = 0

print("Absolute Line analysis:")
for idx, line in enumerate(lines):
    line_num = idx + 1
    content = line.strip()
    
    p_open = content.count('(')
    p_close = content.count(')')
    b_open = content.count('{')
    b_close = content.count('}')
    
    p_balance += (p_open - p_close)
    b_balance += (b_open - b_close)
    
    if line_num >= 1740 and line_num <= 1765:
        if p_open > 0 or p_close > 0 or b_open > 0 or b_close > 0:
            print(f"L{line_num:4d}: P={p_balance:2d} B={b_balance:2d} | {content}")
