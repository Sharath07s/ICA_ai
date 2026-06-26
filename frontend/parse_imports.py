import ast

with open("src/app/intelligence-fusion/page.tsx", "r") as f:
    source = f.read()

print("File contents size:", len(source))
# Note: AST parsing in python only works for python code. But wait! I can just use grep or simple regex.
