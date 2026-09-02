import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if '<div className="h-[100dvh]' in l and 'bg-[#1b262c]' in l:
        start_idx = i - 1  # include return (
        break

if start_idx != -1:
    count = 0
    for i in range(start_idx, len(lines)):
        count += lines[i].count('(')
        count -= lines[i].count(')')
        if count == 0 and ';' in lines[i]:
            end_idx = i
            break

print(f"Start: {start_idx}, End: {end_idx}")
