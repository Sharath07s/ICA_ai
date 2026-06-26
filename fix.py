import os

directory = '/Users/sharathhn/Documents/habit_reminder/3d_shoter/2d_shooter_game/cov_ai/backend/app'
for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if '\\\"\\\"\\\"' in content:
                print(f"Fixing {filepath}")
                new_content = content.replace('\\\"\\\"\\\"', '\"\"\"')
                with open(filepath, 'w') as f:
                    f.write(new_content)
