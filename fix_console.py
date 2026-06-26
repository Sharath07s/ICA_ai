import os
import re

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Replace console.error with console.warn
                new_content = re.sub(r'console\.error', 'console.warn', content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")

if __name__ == "__main__":
    process_directory("/Users/sharathhn/Documents/habit_reminder/3d_shoter/2d_shooter_game/cov_ai/frontend/src")
