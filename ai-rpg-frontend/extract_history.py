import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
start = -1
end = -1
for i, l in enumerate(lines):
    if "{history.map((msg, i) => {" in l:
        start = i
    if start != -1 and "          </div>" in l and i > start + 50:
        # Check if next line is Action Input or something
        if "<div className=\"flex flex-col gap-2 p-2 bg-[#1b262c] rounded mt-2 border border-[#455a64]" in lines[i+2]:
            end = i + 1
            break

print(f"{start} to {end}")
if start != -1 and end != -1:
    with codecs.open('history_extracted.tsx', 'w', 'utf-8') as f:
        f.write("".join(lines[start:end]))
