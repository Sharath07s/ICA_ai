import os
import re

frontend_src = "frontend/src"

for root, _, files in os.walk(frontend_src):
    for file in files:
        if not file.endswith(".tsx") and not file.endswith(".ts"): continue
        path = os.path.join(root, file)
        with open(path, "r") as f:
            content = f.read()
            
        new_content = re.sub(r'(?<!\?)\.map\(', r'?.map(', content)
        new_content = re.sub(r'(?<!\?)\.filter\(', r'?.filter(', new_content)
        new_content = re.sub(r'(?<!\?)\.reduce\(', r'?.reduce(', new_content)
        new_content = re.sub(r'(?<!\?)\.forEach\(', r'?.forEach(', new_content)
        
        if new_content != content:
            with open(path, "w") as f:
                f.write(new_content)
            print(f"Protected arrays in {path}")
