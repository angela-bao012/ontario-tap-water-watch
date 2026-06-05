import os
import time

project_dir = "/Users/angelabao/ontario-tap-water-watch"
now = time.time()
one_day = 24 * 60 * 60

print("Files modified in the last 24 hours:")
for root, dirs, files in os.walk(project_dir):
    if "node_modules" in root or ".git" in root or "dist" in root or "scratch" in root:
        continue
    for f in files:
        if f.startswith('.'):
            continue
        fp = os.path.join(root, f)
        try:
            mtime = os.path.getmtime(fp)
            if now - mtime < one_day:
                rel = os.path.relpath(fp, project_dir)
                print(f"  {rel} (modified {time.ctime(mtime)})")
        except OSError:
            pass
