import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1
for i, l in enumerate(lines):
    if 'gameState === "creation"' in l:
        start = i
    if start != -1 and 'gameState === "playing"' in l:
        end = i
        break
print(f'Creation from {start} to {end-1}')
