import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'return { type: "error", text: "Chybný formát zprávy z historie." };' in l:
        lines[i] = '                console.error("JSON parse failed on:", msg.text, "\\nError:", e);\n' + l

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
