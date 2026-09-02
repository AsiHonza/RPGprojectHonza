import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<div className="relative w-full h-full min-h-[600px] p-10">' in l:
        start_idx = i

print("START", start_idx)
for i in range(start_idx, start_idx+150):
    if "</div>" in lines[i] and "</div>" in lines[i+1]:
        print(i, lines[i].strip())
        print(i+1, lines[i+1].strip())
