import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if 'const dm_data = JSON.parse(msg.text);' in l:
        lines[i] = '''                let t = msg.text.trim();
                if (t.startsWith('```json')) t = t.substring(7);
                if (t.endsWith('```')) t = t.substring(0, t.length - 3);
                t = t.trim();
                const dm_data = JSON.parse(t);\n'''
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
