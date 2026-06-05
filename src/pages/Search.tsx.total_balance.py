file_path = "/Users/angelabao/ontario-tap-water-watch/src/pages/Search.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

p_open = content.count('(')
p_close = content.count(')')
b_open = content.count('{')
b_close = content.count('}')
s_open = content.count('[')
s_close = content.count(']')

print(f"Total count:")
print(f"Parentheses (): open={p_open}, close={p_close}, diff={p_open - p_close}")
print(f"Braces      {{}}: open={b_open}, close={b_close}, diff={b_open - b_close}")
print(f"Brackets    []: open={s_open}, close={s_close}, diff={s_open - s_close}")
