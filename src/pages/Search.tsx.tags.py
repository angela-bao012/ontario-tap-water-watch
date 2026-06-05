import re

file_path = "/Users/angelabao/ontario-tap-water-watch/src/pages/Search.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

tag_stack = []

print("JSX Tag Analysis:")
for idx in range(1749, 2440):
    line_num = idx + 1
    line_content = lines[idx]
    
    # Simple regex to find JSX tags (ignoring comments and self-closing tags)
    # Match opening tags: <tagname ...> (excluding self-closing tags <tagname />)
    opens = re.findall(r"<([a-zA-Z0-9\.]+)(?:\s+[^>]*[^/])?>", line_content)
    # Match closing tags: </tagname>
    closes = re.findall(r"</([a-zA-Z0-9\.]+)>", line_content)
    
    for tag in opens:
        # Ignore comments and tags starting with lowercase unless they are standard html tags,
        # but to be safe track everything.
        if not tag.startswith("!--") and tag != "img" and tag != "input" and tag != "br" and tag != "hr":
            tag_stack.append((tag, line_num))
            
    for tag in closes:
        if tag_stack:
            last_tag, opened_line = tag_stack.pop()
            if last_tag != tag:
                print(f"L{line_num}: Closing tag </{tag}> doesn't match opened <{last_tag}> at L{opened_line}")
        else:
            print(f"L{line_num}: Closing tag </{tag}> has no matching opening tag!")
            
print(f"Remaining open tags in stack: {tag_stack}")
