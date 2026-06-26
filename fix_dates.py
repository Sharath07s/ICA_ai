import os
import re

frontend_src = "frontend/src"

for root, _, files in os.walk(frontend_src):
    for file in files:
        if not file.endswith(".tsx"): continue
        path = os.path.join(root, file)
        with open(path, "r") as f:
            content = f.read()
        
        # Regex to find tags containing {new Date
        # This is a bit tricky, but we can look for:
        # <(span|div|p)([^>]*)>(.*?)\{new Date
        # and add suppressHydrationWarning to group 2 if not present.
        
        def replacer(m):
            tag = m.group(1)
            attrs = m.group(2)
            inner = m.group(3)
            date_call = m.group(4)
            
            if "suppressHydrationWarning" not in attrs:
                return f"<{tag} suppressHydrationWarning{attrs}>{inner}{date_call}"
            return m.group(0)
            
        new_content = re.sub(r'<(span|div|p|h[1-6]|time)([^>]*)>([\s\S]*?)(\{new Date)', replacer, content)
        
        if new_content != content:
            with open(path, "w") as f:
                f.write(new_content)
            print(f"Fixed {path}")
