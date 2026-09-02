import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
print(f'Total lines: {len(lines)}')
for i, l in enumerate(lines):
    if 'return (' in l:
        print(f'Return starts at: {i}')
    if 'gameState === "menu"' in l:
        print(f'Menu starts at: {i}')
    if 'gameState === "creation"' in l:
        print(f'Creation starts at: {i}')
    if 'gameState === "playing"' in l:
        print(f'Playing starts at: {i}')
